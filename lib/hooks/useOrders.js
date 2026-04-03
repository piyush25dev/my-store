// lib/hooks/useOrders.js - FIXED VERSION
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as ordersApi from '@/lib/api/orders';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state and load orders
    checkAuthAndLoadOrders();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Hook] Auth state changed:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('[Hook] User authenticated');
          setIsAuthenticated(true);
          loadOrders();
        } else if (event === 'SIGNED_OUT') {
          console.log('[Hook] User signed out');
          setIsAuthenticated(false);
          setOrders([]);
          setError(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  async function checkAuthAndLoadOrders() {
    try {
      setLoading(true);
      console.log('[Hook] Checking authentication...');

      // Check if user has a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        console.log('[Hook] ✅ Session found');
        setIsAuthenticated(true);
        await loadOrders();
      } else {
        console.log('[Hook] ❌ No session');
        setIsAuthenticated(false);
        setOrders([]);
      }
    } catch (err) {
      console.error('[Hook] Auth check error:', err);
      setIsAuthenticated(false);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    try {
      console.log('[Hook] Loading orders...');
      setLoading(true);
      setError(null);
      
      const data = await ordersApi.getUserOrders();
      console.log('[Hook] Orders loaded:', data?.length || 0);
      setOrders(data || []);
    } catch (err) {
      console.error('[Hook] Load orders error:', err);
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
    reload: loadOrders 
  };
}