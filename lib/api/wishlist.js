// lib/api/wishlist.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function getWishlist() {
  const headers = await getAuthHeader();
  const response = await fetch('/api/wishlist', { headers });
  const data = await response.json();

  if (response.status === 401) return [];
  if (!response.ok) throw new Error(data.error);

  return data.wishlist;
}

export async function addToWishlist(productId) {
  const headers = await getAuthHeader();
  const response = await fetch('/api/wishlist/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ productId }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);

  return data.item;
}

export async function removeFromWishlist(wishlistId) {
  const headers = await getAuthHeader();
  const response = await fetch(`/api/wishlist/${wishlistId}`, {
    method: 'DELETE',
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);

  return data;
}

export async function isInWishlist(productId) {
  const wishlist = await getWishlist();
  return wishlist.some(item => item.product_id === productId);
}