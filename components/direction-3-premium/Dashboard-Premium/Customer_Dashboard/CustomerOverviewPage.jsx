"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  TrendingUp,
  Package,
  ArrowRight,
  Calendar,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getAccessToken } from "@/lib/utils/getAccessToken";

export default function CustomerOverviewPage() {
  const [stats, setStats] = useState([
    {
      label: "Total Orders",
      value: "0",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Wishlisted Items",
      value: "0",
      icon: Heart,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Total Spent",
      value: "₹0",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Active Orders",
      value: "0",
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Get auth token (same logic as test component)
  const getAuthToken = async () => {
    try {
      // Try localStorage first
      let token = localStorage.getItem("access_token");
      if (token) {
        console.log("[Overview] Token from localStorage");
        return token;
      }

      // Fall back to Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      token = session?.access_token;

      if (token) {
        console.log("[Overview] Token from Supabase session");
        // Save for next time
        localStorage.setItem("access_token", token);
        return token;
      }

      throw new Error("No authentication token found");
    } catch (err) {
      console.error("[Overview] Token error:", err);
      throw err;
    }
  };

  // Fetch with auth header
  const fetchWithAuth = async (url) => {
    try {
      const token = await getAccessToken();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Unauthorized - please log in again");
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`[Overview] Fetch error for ${url}:`, err);
      throw err;
    }
  };

  useEffect(() => {
  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[Overview] Fetching dashboard data...");

      // Fetch user orders
      const ordersData = await fetchWithAuth("/api/orders");
      const orders = ordersData.orders || [];
      console.log("[Overview] Orders fetched:", orders.length);

      // Fetch user wishlist
      let wishlistItems = [];
      let wishlistCountValue = 0;
      
      try {
        const wishlistData = await fetchWithAuth("/api/wishlist");
        console.log("[Overview] Wishlist API response:", wishlistData);
        
        // Handle the actual response structure { success: true, wishlist: [...] }
        if (wishlistData.success && wishlistData.wishlist && Array.isArray(wishlistData.wishlist)) {
          wishlistItems = wishlistData.wishlist;
          wishlistCountValue = wishlistData.wishlist.length;
        } 
        // Fallback for other possible structures
        else if (Array.isArray(wishlistData)) {
          wishlistItems = wishlistData;
          wishlistCountValue = wishlistData.length;
        } else if (wishlistData.wishlistItems && Array.isArray(wishlistData.wishlistItems)) {
          wishlistItems = wishlistData.wishlistItems;
          wishlistCountValue = wishlistData.wishlistItems.length;
        } else if (wishlistData.items && Array.isArray(wishlistData.items)) {
          wishlistItems = wishlistData.items;
          wishlistCountValue = wishlistData.items.length;
        } else if (wishlistData.data && Array.isArray(wishlistData.data)) {
          wishlistItems = wishlistData.data;
          wishlistCountValue = wishlistData.data.length;
        } else if (wishlistData.count !== undefined) {
          wishlistCountValue = wishlistData.count;
        }
        
        console.log("[Overview] Wishlist fetched:", wishlistCountValue, "items");
      } catch (err) {
        console.warn(
          "[Overview] Wishlist fetch failed (endpoint may not exist):",
          err.message,
        );
        // Continue without wishlist data
      }

      // Fetch products for recommendations (if endpoint exists)
      let products = [];
      try {
        const productsData = await fetchWithAuth("/api/products");
        products = productsData.products || [];
        console.log("[Overview] Products fetched:", products.length);
      } catch (err) {
        console.warn(
          "[Overview] Products fetch failed (endpoint may not exist):",
          err.message,
        );
        // Continue without products data
      }

      // Calculate stats
      const totalOrders = orders.length;
      const totalWishlisted = wishlistCountValue;
      const totalSpent = orders.reduce((sum, order) => {
        const amount = parseInt(
          order.total_amount / 100 || order.total_price / 100 || 0,
        );
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      const activeOrders = orders.filter((order) => {
        const status = order.status?.toLowerCase();
        return (
          status === "pending" ||
          status === "in transit" ||
          status === "in_transit" ||
          status === "processing"
        );
      }).length;

      console.log("[Overview] Stats calculated:", {
        totalOrders,
        totalWishlisted,
        totalSpent,
        activeOrders
      });

      // Update stats
      setStats((prevStats) => [
        {
          ...prevStats[0],
          value: totalOrders.toString(),
        },
        {
          ...prevStats[1],
          value: totalWishlisted.toString(),
        },
        {
          ...prevStats[2],
          value: `₹${totalSpent.toLocaleString()}`,
        },
        {
          ...prevStats[3],
          value: activeOrders.toString(),
        },
      ]);

      // Format recent orders
      const formattedOrders = orders.slice(0, 3).map((order, index) => {
        const productName =
          order.order_items?.[0]?.products?.name ||
          order.product_name ||
          `Product ${index + 1}`;

        return {
          id: `#ORD-${String(order.id).slice(-4)}`,
          product: productName,
          date: new Date(order.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          amount: `₹${(order.total_amount / 100 || order.total_price / 100 || 0).toLocaleString()}`,
          status: order.status || "Pending",
          statusColor: getStatusColor(order.status),
        };
      });

      // Format recommendations using wishlist products or fallback to all products
      let formattedRecommendations = [];
      
      if (wishlistItems.length > 0) {
        // Use wishlist products as recommendations
        formattedRecommendations = wishlistItems.slice(0, 3).map((item, index) => ({
          id: item.product_id,
          name: item.products?.name || "Product",
          category: "Wishlist Item",
          price: `₹${Math.floor((item.products?.price || 0) / 100).toLocaleString()}`,
          rating: "4.5",
          image: `bg-gradient-to-br ${
            [
              "from-blue-400 to-blue-600",
              "from-green-400 to-green-600",
              "from-purple-400 to-purple-600",
            ][index % 3]
          }`,
        }));
      } else if (products.length > 0) {
        // Fallback to regular products
        formattedRecommendations = products.slice(0, 3).map((product, index) => ({
          id: product.id,
          name: product.name,
          category: product.category || "Product",
          price: `₹${Math.floor((product.price || 0) / 100).toLocaleString()}`,
          rating: (product.rating || 4.5).toFixed(1),
          image: `bg-gradient-to-br ${
            [
              "from-blue-400 to-blue-600",
              "from-green-400 to-green-600",
              "from-purple-400 to-purple-600",
            ][index % 3]
          }`,
        }));
      }

      setRecentOrders(formattedOrders);
      setRecommendations(formattedRecommendations);
      setWishlistCount(totalWishlisted);
      
      console.log("[Overview] Dashboard data updated successfully", {
        wishlistCount: totalWishlisted,
        recommendationsCount: formattedRecommendations.length
      });
    } catch (err) {
      console.error("[Overview] Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  fetchOverviewData();
}, []);

  // Helper function to get status color
  const getStatusColor = (status) => {
    if (!status) return "bg-yellow-100 text-yellow-800";

    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
      case "in transit":
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening with your account
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error loading dashboard</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} rounded-xl p-3`}>
                  <Icon
                    className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link
                href="/dashboard/customer/orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="w-full overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="min-w-[500px] md:min-w-0 space-y-4">
                    {recentOrders.map((order, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {order.product}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <span className="text-sm text-gray-600 flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{order.date}</span>
                            </span>
                            <span className="text-sm text-gray-600 truncate">
                              {order.id}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">
                            {order.amount}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${order.statusColor}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Recommended for You */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Recommended
            </h3>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div
                      className={`${item.image} h-24 rounded-xl mb-2 shadow-sm group-hover:shadow-md transition-all duration-300`}
                    />
                    <p className="font-medium text-gray-900 text-sm line-clamp-2">
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-blue-600 font-semibold text-sm">
                        {item.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                          {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No products available</p>
            )}
          </div>

          {/* Alert */}
          {wishlistCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 text-sm">
                    {wishlistCount} items in your wishlist
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Great deals available on your wishlisted items
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
