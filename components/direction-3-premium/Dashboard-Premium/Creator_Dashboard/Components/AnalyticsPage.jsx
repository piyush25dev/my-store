"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Globe, ShoppingBag } from "lucide-react";
import { getAccessToken } from "@/lib/utils/getAccessToken";

const BAR_COLORS = ["bg-blue-500", "bg-purple-500", "bg-violet-400", "bg-indigo-300", "bg-blue-300"];

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

// Build last-6-months buckets from orders
function buildMonthlyData(orders) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString("en-IN", { month: "short" }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      revenue: 0,
      orders: 0,
    };
  });

  for (const order of orders) {
    const key = order.created_at?.slice(0, 7);
    const bucket = months.find((m) => m.key === key);
    if (!bucket) continue;
    bucket.orders += 1;
    if ((order.status ?? "").toLowerCase() !== "refunded") {
      bucket.revenue += Number(order.total_amount ?? 0);
    }
  }
  return months;
}

// Aggregate revenue by product name from order_items
function buildProductRevenue(orders) {
  const map = new Map();
  for (const order of orders) {
    if ((order.status ?? "").toLowerCase() === "refunded") continue;
    for (const item of order.order_items ?? []) {
      const name = item.products?.name ?? item.product_name ?? "Unknown";
      const prev = map.get(name) ?? 0;
      map.set(name, prev + Number(item.line_total ?? 0));
    }
  }
  const entries = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  return entries.map(([name, revenue]) => ({
    name,
    revenue,
    pct: Math.round((revenue / total) * 100),
  }));
}

// Aggregate orders by country from shipping_address
function buildCountryData(orders) {
  const map = new Map();
  for (const order of orders) {
    const country = order.shipping_address?.country ?? "Unknown";
    map.set(country, (map.get(country) ?? 0) + 1);
  }
  const entries = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  return entries.map(([country, count]) => ({
    country,
    orders: count,
    pct: Math.round((count / total) * 100),
  }));
}

export default function AnalyticsPage() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const token = await getAccessToken();
      const res = await fetch("/api/creator-orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Derived data ────────────────────────────────────────────────────────────

  const nonRefunded  = orders.filter(o => (o.status ?? "").toLowerCase() !== "refunded");
  const refunded     = orders.filter(o => (o.status ?? "").toLowerCase() === "refunded");

  const totalRevenue = nonRefunded.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);
  const totalOrders  = orders.length;
  const avgOrderVal  = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const refundRate   = totalOrders > 0 ? ((refunded.length / totalOrders) * 100).toFixed(1) : "0.0";

  const monthlyData     = buildMonthlyData(orders);
  const productRevenue  = buildProductRevenue(orders);
  const countryData     = buildCountryData(orders);

  const maxRev    = Math.max(...monthlyData.map(m => m.revenue), 1);
  const maxOrders = Math.max(...monthlyData.map(m => m.orders), 1);
  const totalProductRev = productRevenue.reduce((s, p) => s + p.revenue, 0);

  const kpis = [
    {
      label: "Total Revenue",
      value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      up: true,
      color: "text-emerald-600",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: TrendingUp,
      up: true,
      color: "text-emerald-600",
    },
    {
      label: "Avg Order Value",
      value: `₹${(avgOrderVal / 100).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      up: true,
      color: "text-emerald-600",
    },
    {
      label: "Refund Rate",
      value: `${refundRate}%`,
      icon: TrendingDown,
      up: false,
      color: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Performance overview · {new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          Failed to load analytics: {error}
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon: Icon, up, color }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              {loading
                ? <Skeleton className="h-7 w-24 mt-1" />
                : <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
              }
              <div className="flex items-center gap-1 mt-1">
                <Icon className={`w-3 h-3 ${color}`} />
                <span className={`text-[10px] font-semibold ${color}`}>
                  {loading ? "—" : up ? "from orders" : "of total"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue & Orders chart */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-slate-900">Revenue & Orders</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-purple-400" />
                <span className="text-slate-500">Orders</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 pb-4 px-5">
          {loading
            ? <div className="flex items-end gap-3 h-40">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-1 flex gap-1 items-end">
                    <Skeleton className="flex-1" style={{ height: `${40 + i * 12}px` }} />
                    <Skeleton className="flex-1" style={{ height: `${20 + i * 8}px` }} />
                  </div>
                ))}
              </div>
            : <>
                <div className="flex items-end gap-3 sm:gap-5 h-40">
                  {monthlyData.map(({ month, revenue, orders: cnt }) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex gap-1 items-end">
                        <div
                          className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 min-h-[4px]"
                          style={{ height: `${Math.max(Math.round((revenue / maxRev) * 120), 4)}px` }}
                        />
                        <div
                          className="flex-1 rounded-t-md bg-gradient-to-t from-purple-400 to-purple-300 min-h-[4px]"
                          style={{ height: `${Math.max(Math.round((cnt / maxOrders) * 120), 4)}px` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400">{month}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-3 mt-3 pt-3 border-t border-slate-100">
                  {monthlyData.map(({ month, revenue, orders: cnt }) => (
                    <div key={month} className="text-center">
                      <p className="text-[9px] text-slate-500 font-medium">
                        ₹{((revenue / 100) / 1000).toFixed(0)}k
                      </p>
                      <p className="text-[9px] text-slate-400">{cnt} orders</p>
                    </div>
                  ))}
                </div>
              </>
          }
        </CardContent>
      </Card>

      {/* Product breakdown + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Revenue by product */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              Revenue by Product
            </h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5 animate-pulse">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}

            {!loading && productRevenue.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No product revenue data yet.</p>
            )}

            {!loading && productRevenue.map(({ name, revenue, pct }, i) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${BAR_COLORS[i]}`} />
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{((revenue / 100) / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${BAR_COLORS[i]} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}

            {!loading && productRevenue.length > 0 && (
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <span className="text-xs text-slate-400">Total</span>
                <span className="text-sm font-bold text-slate-900">
                  ₹{((totalProductRev / 100) / 1000).toFixed(1)}k
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customers by country */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              Customers by Country
            </h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <Skeleton className="w-5 h-5 rounded-md shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
              </div>
            ))}

            {!loading && countryData.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                No country data yet. Make sure shipping addresses include a country field.
              </p>
            )}

            {!loading && countryData.map(({ country, orders: cnt, pct }, i) => (
              <div key={country} className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-semibold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{country}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900">{cnt}</span>
                      <span className="text-[10px] text-slate-400 ml-1">orders</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 w-8 text-right shrink-0">{pct}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}