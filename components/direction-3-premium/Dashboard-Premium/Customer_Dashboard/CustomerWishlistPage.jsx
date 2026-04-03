// components/direction-3-premium/Dashboard-Premium/Customer_Dashboard/Components/WishlistPage.jsx
// Customer Wishlist Page - Minimal data version with FIXED PRICE

'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CustomerWishlistPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const categories = ['all', 'Design', 'Templates', 'Code', 'Content'];

  // Get fresh token from Supabase (always gets current valid token)
  const getFreshToken = async () => {
    try {
      console.log('[Wishlist] Getting fresh token from Supabase...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[Wishlist] Session error:', sessionError);
        throw new Error('Failed to get session: ' + sessionError.message);
      }

      if (!session?.access_token) {
        console.error('[Wishlist] No access token in session');
        throw new Error('Not authenticated - please log in');
      }

      console.log('[Wishlist] ✅ Fresh token obtained:', session.access_token.substring(0, 30) + '...');
      
      localStorage.setItem('access_token', session.access_token);
      
      return session.access_token;
    } catch (err) {
      console.error('[Wishlist] Token error:', err);
      throw err;
    }
  };

  // Fetch with fresh token and auto-refresh on 401
  const fetchWithFreshToken = async (url, options = {}) => {
    try {
      const token = await getFreshToken();

      console.log(`[Wishlist] Fetching ${url}...`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      console.log(`[Wishlist] Response status: ${response.status}`);

      if (response.status === 401) {
        console.error('[Wishlist] 401 Unauthorized - attempting to refresh token');
        localStorage.removeItem('access_token');
        
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw new Error('Session expired - please log in again');
        }
        
        return await fetchWithFreshToken(url, options);
      }

      if (!response.ok) {
        const data = await response.json();
        console.error(`[Wishlist] API error:`, data);
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[Wishlist] ✅ Data fetched`);
      return data;
    } catch (err) {
      console.error(`[Wishlist] Fetch error:`, err);
      throw err;
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[Wishlist] Loading wishlist...');

      const data = await fetchWithFreshToken('/api/wishlist');
      const apiWishlist = data.wishlist || [];

      console.log('[Wishlist] Raw data received:', apiWishlist);

      // Transform wishlist items from API response
      const transformedItems = apiWishlist.map((item, index) => {
        const product = item.products || {};
        
        // Price is stored in cents, convert to rupees (divide by 100)
        const priceCents = parseInt(product.price || 0);
        const price = Math.floor(priceCents / 100);
        
        // Estimate original price (50% discount)
        const originalPrice = Math.floor(price * 1.5);
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

        console.log(`[Wishlist] Item ${index}:`, {
          productId: item.product_id,
          name: product.name,
          priceCents: priceCents,
          priceRupees: price,
          originalPrice: originalPrice
        });

        return {
          id: item.id,
          productId: item.product_id,
          name: product.name || `Product ${item.product_id}`,
          category: 'Other', // No category in minimal data
          price: `₹${price.toLocaleString()}`,
          originalPrice: `₹${originalPrice.toLocaleString()}`,
          discount: `${discount}%`,
          rating: 4.5, // Default rating
          reviews: 0,
          inStock: true, // Default to in stock
          image: `bg-gradient-to-br ${getRandomGradient()}`,
          description: 'Premium product',
          addedDate: new Date(item.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        };
      });

      setWishlistItems(transformedItems);
      console.log('[Wishlist] ✅ Wishlist loaded:', transformedItems.length);
    } catch (err) {
      console.error('[Wishlist] Error loading wishlist:', err);
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const handleRemoveFromWishlist = async (id) => {
    try {
      setDeleting(id);
      console.log('[Wishlist] Removing item:', id);

      await fetchWithFreshToken(`/api/wishlist/${id}`, {
        method: 'DELETE',
      });

      // Remove from UI
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      console.log('[Wishlist] ✅ Item removed');
    } catch (err) {
      console.error('[Wishlist] Error removing item:', err);
      setError(err.message || 'Failed to remove item');
    } finally {
      setDeleting(null);
    }
  };

  const filteredItems = wishlistItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSavings = wishlistItems.reduce((sum, item) => {
    const originalPrice = parseInt(item.originalPrice.replace('₹', '').replace(',', ''));
    const currentPrice = parseInt(item.price.replace('₹', '').replace(',', ''));
    return sum + (originalPrice - currentPrice);
  }, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-gray-600 mt-1">Save and manage your favorite items</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
        <p className="text-gray-600 mt-1">Save and manage your favorite items</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error loading wishlist</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={loadWishlist}
              className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      {wishlistItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200/50">
            <p className="text-red-600 text-sm font-medium">Total Items</p>
            <p className="text-3xl font-bold text-red-900 mt-2">{wishlistItems.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50">
            <p className="text-green-600 text-sm font-medium">Total Savings</p>
            <p className="text-3xl font-bold text-green-900 mt-2">₹{totalSavings.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50">
            <p className="text-blue-600 text-sm font-medium">In Stock</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {wishlistItems.filter((item) => item.inStock).length}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Add All to Cart */}
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 transition-all duration-300">
            <ShoppingCart className="w-5 h-5" />
            Add All to Cart
          </button>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <div className={`${item.image} h-48 w-full group-hover:scale-105 transition-transform duration-300`} />

                {/* Discount Badge */}
                {item.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{item.discount}
                  </div>
                )}

                {/* Stock Status */}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  disabled={deleting === item.id}
                  className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                >
                  {deleting === item.id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                  ) : (
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Category & Date */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">Added {item.addedDate}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 line-clamp-2">{item.name}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.rating} ({item.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                  <span className="text-lg text-gray-400 line-through">{item.originalPrice}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    disabled={!item.inStock}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      item.inStock
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={deleting === item.id}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 disabled:opacity-50"
                  >
                    {deleting === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">
            {wishlistItems.length === 0 ? 'No items in your wishlist' : 'No items match your search'}
          </p>
          <p className="text-gray-500 mt-2">
            {wishlistItems.length === 0 
              ? 'Start adding items to save them for later' 
              : 'Try adjusting your search or filter'}
          </p>
        </div>
      )}
    </div>
  );
}