'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect, useState, useRef } from 'react';
import DashboardShell from '@/components/direction-3-premium/Dashboard-Premium/DashboardShell';
import { supabase } from '@/lib/supabase';

const ROLE_CONFIG = {
  customer: {
    label: 'Customer',
    isAdmin: false,
    tabs: ['overview', 'orders', 'wishlist', 'settings'],
  },
  creator: {
    label: 'Creator',
    isAdmin: false,
    tabs: ['overview', 'products', 'orders', 'analytics', 'settings'],
  },
  admin: {
    label: 'Admin',
    isAdmin: true,
    tabs: ['overview', 'users', 'orders', 'analytics', 'settings', 'moderation'],
  },
};

// Retry a supabase call up to `maxAttempts` times with a delay between each.
// This handles the race between email-confirmation redirect and the DB trigger
// that creates the profile row.
async function fetchProfileWithRetry(userId, maxAttempts = 5, delayMs = 800) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single();

    // 406 = PGRST116 "no rows" — profile not created yet, keep retrying
    if (!error) return { data, error: null };

    const isNoRows =
      error.code === 'PGRST116' ||
      error.message?.toLowerCase().includes('no rows') ||
      error.status === 406;

    if (!isNoRows) {
      // A real error (permissions, network etc.) — stop retrying
      return { data: null, error };
    }

    if (attempt < maxAttempts) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  // All retries exhausted — profile genuinely missing, fall back to metadata
  return { data: null, error: { message: 'Profile not found after retries' } };
}

export default function DashboardLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const [userRole,    setUserRole]    = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [error,       setError]       = useState(null);

  // Prevent the effect running twice in React strict mode
  const fetchedRef = useRef(false);

  // ── Fetch profile (with retry for email-confirmation race) ─────────────────
  useEffect(() => {
    if (!user || fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchUserProfile = async () => {
      try {
        setUserLoading(true);
        setError(null);

        const { data, error: profileError } = await fetchProfileWithRetry(user.id);

        if (data?.user_role) {
          setUserRole(data.user_role);
          return;
        }

        // Profile still missing after retries — recover using auth metadata
        // (the trigger should have stored user_role there during signUp)
        const metaRole = user.user_metadata?.user_role;
        const safeRole = ['customer', 'creator', 'admin'].includes(metaRole)
          ? metaRole
          : 'customer';

        console.warn(
          '[DashboardLayout] Profile not found, falling back to metadata role:',
          safeRole
        );

        // Attempt to create the profile row ourselves as a last resort
        await supabase.from('profiles').upsert({
          id:           user.id,
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user_role:    safeRole,
          is_verified:  false,
          created_at:   new Date().toISOString(),
          updated_at:   new Date().toISOString(),
        }, { onConflict: 'id' });

        setUserRole(safeRole);

      } catch (err) {
        console.error('[DashboardLayout] Profile fetch failed:', err);
        // Don't show error screen — fall back to customer silently
        setUserRole('customer');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Reset the ref when user changes (e.g. after sign-out / sign-in cycle)
  useEffect(() => {
    if (!user) {
      fetchedRef.current = false;
      setUserRole(null);
      setUserLoading(true);
      setError(null);
    }
  }, [user]);

  // ── Redirect unauthenticated users ─────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(pathname));
    }
  }, [user, loading, router, pathname]);

  // ── Parse pathname ─────────────────────────────────────────────────────────
  const segments     = pathname.split('/').filter(Boolean);
  const roleFromPath = segments[1]; // e.g. 'creator'
  const tabSlug      = segments[2]; // e.g. 'products'

  // ── Redirect if path role doesn't match actual role ────────────────────────
  useEffect(() => {
    if (
      !userLoading &&
      userRole &&
      roleFromPath &&
      roleFromPath !== userRole &&
      Object.keys(ROLE_CONFIG).includes(roleFromPath) // only redirect for known roles
    ) {
      router.replace(`/dashboard/${userRole}/overview`);
    }
  }, [userRole, roleFromPath, router, userLoading]);

  const config    = ROLE_CONFIG[userRole] || ROLE_CONFIG.customer;
  const validTabs = config.tabs;
  const activeTab = validTabs.indexOf(tabSlug) >= 0 ? validTabs.indexOf(tabSlug) : 0;

  const handleTabChange = (slug) => {
    router.push(`/dashboard/${userRole}/${slug}`);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
          <p className="text-gray-600 text-sm">
            {userLoading && user ? 'Setting up your dashboard…' : 'Loading…'}
          </p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardShell
      role={userRole}
      label={config.label}
      isAdmin={config.isAdmin}
      tabs={validTabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {children}
    </DashboardShell>
  );
}