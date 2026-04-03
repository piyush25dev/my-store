// lib/auth.js - Ensure token is stored on login

import { supabase } from '@/lib/supabase';

export async function handleLogin(email, password) {
  try {
    console.log('[Auth] Logging in...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[Auth] ❌ Login failed:', error.message);
      throw error;
    }

    const token = data.session?.access_token;
    console.log('[Auth] ✅ Login successful');
    console.log('[Auth] Token:', token?.substring(0, 30) + '...');

    // IMPORTANT: Store token in localStorage
    if (token) {
      localStorage.setItem('access_token', token);
      console.log('[Auth] ✅ Token stored in localStorage');
    }

    return { user: data.user, session: data.session };

  } catch (error) {
    console.error('[Auth] Login error:', error);
    throw error;
  }
}

export async function handleLogout() {
  try {
    console.log('[Auth] Logging out...');
    
    await supabase.auth.signOut();
    
    // Clear token from localStorage
    localStorage.removeItem('access_token');
    console.log('[Auth] ✅ Logged out and token cleared');

  } catch (error) {
    console.error('[Auth] Logout error:', error);
    throw error;
  }
}

export async function getAuthToken() {
  // Try localStorage first
  const storedToken = localStorage.getItem('access_token');
  if (storedToken) {
    return storedToken;
  }

  // Fall back to session
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    localStorage.setItem('access_token', session.access_token);
    return session.access_token;
  }

  return null;
}

export async function setupAuthListener() {
  console.log('[Auth] Setting up auth state listener');

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('[Auth] State changed:', event);

      if (event === 'SIGNED_IN' && session?.access_token) {
        console.log('[Auth] User signed in - storing token');
        localStorage.setItem('access_token', session.access_token);
      } else if (event === 'SIGNED_OUT') {
        console.log('[Auth] User signed out - clearing token');
        localStorage.removeItem('access_token');
      } else if (event === 'TOKEN_REFRESHED' && session?.access_token) {
        console.log('[Auth] Token refreshed - updating storage');
        localStorage.setItem('access_token', session.access_token);
      }
    }
  );

  return subscription;
}