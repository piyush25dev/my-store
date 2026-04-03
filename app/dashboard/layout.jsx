// app/dashboard/layout.jsx
// Fixed dashboard layout with proper role-based routing

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
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
    tabs: ['overview', 'creators', 'users', 'orders', 'analytics', 'settings', 'moderation'],
  },
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile to get role
  useEffect(() => {
  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      setUserLoading(true);
      
      // ✅ Query supabase directly — no session timing issues
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserRole(data?.user_role || 'customer');
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
      setUserRole('customer');
    } finally {
      setUserLoading(false);
    }
  };

  fetchUserProfile();
}, [user]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=' + pathname);
    }
  }, [user, loading, router, pathname]);

  // Parse pathname to extract role and tab
  // Path format: /dashboard/[role]/[tab]
  // e.g., /dashboard/creator/products
  const segments = pathname.split('/').filter(Boolean);
  const roleFromPath = segments[1]; // 'creator', 'admin', or 'customer'
  const tabSlug = segments[2]; // 'products', 'orders', etc.

  // Validate role from path matches user's role
  // If not, redirect to correct dashboard
 useEffect(() => {
  if (!userLoading && userRole && roleFromPath && roleFromPath !== userRole) {
    router.push(`/dashboard/${userRole}/overview`);
  }
}, [userRole, roleFromPath, router, userLoading]);

  // Get config for current user's role
  const config = ROLE_CONFIG[userRole] || ROLE_CONFIG.customer;
  const validTabs = config.tabs;

  // Find active tab index (default to first tab)
  const activeTab = validTabs.indexOf(tabSlug) >= 0 
    ? validTabs.indexOf(tabSlug) 
    : 0;

  // Handle tab change
  const handleTabChange = (tabSlug) => {
    router.push(`/dashboard/${userRole}/${tabSlug}`);
  };

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render dashboard
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