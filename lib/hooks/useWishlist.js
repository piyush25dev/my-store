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
      await wishlistApi.addToWishlist(productId);
      await loadWishlist();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }
 
  async function remove(wishlistId) {
    try {
      await wishlistApi.removeFromWishlist(wishlistId);
      await loadWishlist();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }
 
  function isInWishlist(productId) {
    return wishlist.some(item => item.product_id === productId);
  }
 
  return { wishlist, loading, error, add, remove, isInWishlist, reload: loadWishlist };
}