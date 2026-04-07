// lib/hooks/useCreatorOrders.js
// Fetches orders that contain products created by the authenticated user.

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getAccessToken } from '@/lib/utils/getAccessToken';

export function useCreatorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();

    // Re-fetch whenever auth state changes (sign-in / sign-out / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(true);
          loadOrders();
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setOrders([]);
          setError(null);
          setLoading(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuthAndLoad() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        setIsAuthenticated(true);
        await loadOrders();
      } else {
        setIsAuthenticated(false);
        setOrders([]);
        setLoading(false);
      }
    } catch (err) {
      console.error('[useCreatorOrders] Auth check error:', err);
      setIsAuthenticated(false);
      setOrders([]);
      setLoading(false);
    }
  }

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessToken();

      const response = await fetch('/api/creator-orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setOrders([]);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      console.log('[useCreatorOrders] Orders loaded:', data.orders?.length ?? 0);
      setOrders(data.orders || []);
    } catch (err) {
      console.error('[useCreatorOrders] Load error:', err);
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    orders,
    loading,
    error,
    isAuthenticated,
    reload: loadOrders,
  };
}