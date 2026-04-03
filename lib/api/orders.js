// lib/api/orders.js - FIXED TO READ FROM CORRECT SUPABASE KEY
import { supabase } from '@/lib/supabase';

// Extract token from Supabase's localStorage key
function getTokenFromSupabaseStorage() {
  try {
    if (typeof window === 'undefined') return null;

    // Look for Supabase's auth token in localStorage
    // It's usually stored under a key like: sb-{PROJECT_ID}-auth-token
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Look for Supabase auth token keys
      if (key && key.includes('auth-token')) {
        try {
          const value = localStorage.getItem(key);
          
          // Try to parse as JSON (Supabase stores it as JSON object)
          let tokenData;
          try {
            tokenData = JSON.parse(value);
          } catch {
            // If not JSON, use raw value
            tokenData = value;
          }

          // Extract access_token from the object
          if (typeof tokenData === 'object' && tokenData.access_token) {
            console.log('[Token] Found in Supabase storage key:', key);
            return tokenData.access_token;
          }

          // Or if it's stored as plain JWT string
          if (typeof tokenData === 'string' && tokenData.startsWith('eyJ')) {
            console.log('[Token] Found in Supabase storage key:', key);
            return tokenData;
          }
        } catch (e) {
          continue;
        }
      }
    }
  } catch (error) {
    console.error('[Token] Supabase storage error:', error);
  }

  return null;
}

// Get token from Supabase session
async function getTokenFromSupabaseSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      console.log('[Token] Found in Supabase session');
      return session.access_token;
    }
  } catch (error) {
    console.error('[Token] Supabase session error:', error);
  }

  return null;
}

// Main function to get token
async function getAuthToken() {
  console.log('[Token] Getting auth token...');
  
  // Try Supabase localStorage first (most reliable)
  let token = getTokenFromSupabaseStorage();
  if (token) {
    console.log('[Token] ✅ Got from Supabase storage:', token.substring(0, 30) + '...');
    return token;
  }

  // Fall back to Supabase session
  token = await getTokenFromSupabaseSession();
  if (token) {
    console.log('[Token] ✅ Got from Supabase session:', token.substring(0, 30) + '...');
    return token;
  }

  console.error('[Token] ❌ No token found in storage or session');
  throw new Error('Not authenticated - no token found');
}

export async function getUserOrders() {
  console.log('[API] getUserOrders() called');
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.error('[API] ❌ No token available');
      return [];
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    console.log('[Fetch] GET /api/orders');
    console.log('[Fetch] Auth header:', headers.Authorization.substring(0, 40) + '...');

    const response = await fetch('/api/orders', {
      method: 'GET',
      headers: headers,
    });

    console.log('[Fetch] Response status:', response.status);

    if (response.status === 401) {
      console.warn('[API] ❌ 401 Unauthorized');
      return [];
    }

    if (!response.ok) {
      const data = await response.json();
      console.error('[API] ❌ Error:', data);
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('[API] ✅ Orders fetched:', data.orders?.length || 0);
    return data.orders || [];

  } catch (error) {
    console.error('[API] ❌ Error:', error.message);
    return [];
  }
}

export async function getOrderDetails(orderId) {
  console.log('[API] getOrderDetails() called with:', orderId);
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('[API] ✅ Order details fetched');
    return data.order;

  } catch (error) {
    console.error('[API] ❌ Error:', error.message);
    throw error;
  }
}

export async function createOrder(items, shippingAddress, paymentInfo = {}) {
  console.log('[API] createOrder() called');
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        items, 
        shippingAddress, 
        paymentInfo 
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('[API] ✅ Order created:', data.order?.id);
    return data.order;

  } catch (error) {
    console.error('[API] ❌ Error:', error.message);
    throw error;
  }
}