"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getAccessToken } from "@/lib/utils/getAccessToken";

export default function CustomerOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load orders when component mounts
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessToken();

      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load orders");
      }

      const data = await response.json();

      // keep your existing transformation logic...
      const transformedOrders = (data.orders || []).map((order) => ({
        id: `#ORD-${String(order.id).padStart(3, "0")}`,
        product: order.order_items?.[0]?.products?.name || "Unknown Product",
        category: "Digital",
        date: new Date(order.created_at).toLocaleDateString("en-US"),
        amount: `₹${order.total_amount / 100}`,
        status: order.status || "Pending",
        statusColor: getStatusColor(order.status),
        statusIcon: getStatusIcon(order.status),
        items: order.order_items?.length || 0,
        description: `Order containing ${order.order_items?.length || 0} item(s)`,
      }));

      setOrders(transformedOrders);
    } catch (err) {
      console.error("[Orders Page] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return CheckCircle;
      case "in transit":
      case "in_transit":
        return Truck;
      case "cancelled":
        return AlertCircle;
      default:
        return Package;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      order.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { label: "All Orders", value: "all" },
    { label: "Delivered", value: "delivered" },
    { label: "In Transit", value: "in transit" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Pending", value: "pending" },
  ];

  const totalSpent = orders.reduce((sum, order) => {
    const amount = parseInt(order.amount.replace("₹", "").replace(",", ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your purchases
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your purchases
          </p>
        </div>
        <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
        <p className="text-gray-600 mt-1">
          Manage and track all your purchases
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50">
          <p className="text-blue-600 text-sm font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {orders.length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50">
          <p className="text-green-600 text-sm font-medium">Total Spent</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200/50">
          <p className="text-purple-600 text-sm font-medium">Delivered</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {
              orders.filter((o) => o.status.toLowerCase() === "delivered")
                .length
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Download */}
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 transition-all duration-300">
            <Download className="w-5 h-5" />
            Download Invoice
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const StatusIcon = order.statusIcon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {order.product}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.id} • {order.date} • {order.items}{" "}
                        {order.items === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {order.amount}
                      </p>
                      <div
                        className={`flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Order Details */}
                {isExpanded && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Description
                      </p>
                      <p className="text-gray-700">{order.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Category
                        </p>
                        <p className="text-gray-900 font-medium mt-1">
                          {order.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Order Date
                        </p>
                        <p className="text-gray-900 font-medium mt-1">
                          {order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-900 font-medium transition-all duration-300">
                        View Details
                      </button>
                      <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300">
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/60">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No orders found</p>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
