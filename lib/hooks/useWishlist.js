// lib/hooks/useWishlist.js
import { useState, useEffect } from 'react';
import * as wishlistApi from '@/lib/api/wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      setLoading(true);
      const data = await wishlistApi.getWishlist();
      setWishlist(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function add(productId) {
    try {
      const item = await wishlistApi.addToWishlist(productId);
      // ✅ optimistic update — no need to refetch
      setWishlist(prev => [...prev, item]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function remove(wishlistId) {
    // ✅ optimistic update first so UI responds immediately
    setWishlist(prev => prev.filter(item => item.id !== wishlistId));
    try {
      await wishlistApi.removeFromWishlist(wishlistId);
    } catch (err) {
      // rollback on failure
      setError(err.message);
      await loadWishlist();
      throw err;
    }
  }

  function isInWishlist(productId) {
  return wishlist.some(item => String(item.product_id) === String(productId));
}

  return { wishlist, loading, error, add, remove, isInWishlist, reload: loadWishlist };
}