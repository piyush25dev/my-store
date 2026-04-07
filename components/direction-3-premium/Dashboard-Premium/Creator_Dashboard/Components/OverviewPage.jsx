"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee, ShoppingCart, Package, TrendingUp,
  Clock, CheckCircle2, XCircle, ArrowUpRight, Zap, Loader,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getAccessToken } from "@/lib/utils/getAccessToken";
import Link from "next/link";

// ─── Status config ────────────────────────────────────────────────────────────

const statusStyle = {
  completed:  "bg-emerald-100 text-emerald-700",
  processing: "bg-amber-100 text-amber-700",
  pending:    "bg-amber-100 text-amber-700",
  refunded:   "bg-rose-100 text-rose-700",
};

const COLOR_BG   = { emerald:"bg-emerald-50", blue:"bg-blue-50", purple:"bg-purple-50", amber:"bg-amber-50" };
const COLOR_TEXT = { emerald:"text-emerald-600", blue:"text-blue-600", purple:"text-purple-600", amber:"text-amber-600" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCurrency(paise) {
  // order totals come in paise (×100), product prices too
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function fmtK(paise) {
  return `₹${((paise / 100) / 1000).toFixed(1)}k`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Build last-6-months revenue buckets from orders
function buildRevenueByMonth(orders) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString("en-IN", { month: "short" }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      revenue: 0,
    };
  });

  for (const order of orders) {
    if ((order.status ?? "").toLowerCase() === "refunded") continue;
    const key = order.created_at?.slice(0, 7);
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.revenue += Number(order.total_amount ?? 0);
  }
  return months;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

// ─── Overview Page ────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [profile,  setProfile]  = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Parallel fetch: profile + creator orders + creator products
      const [profileRes, ordersRes, productsRes] = await Promise.all([
        fetch("/api/profile",         { headers }),
        fetch("/api/creator-orders",  { headers }),
        fetch("/api/products?creator_only=true&page=1", { headers }),
      ]);

      const [profileData, ordersData, productsData] = await Promise.all([
        profileRes.json(),
        ordersRes.json(),
        productsRes.json(),
      ]);

      if (profileRes.ok)  setProfile(profileData.profile);
      if (ordersRes.ok)   setOrders(ordersData.orders   || []);
      if (productsRes.ok) setProducts(productsData.products || []);

    } catch (err) {
      console.error("[Overview] load error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Derived stats ───────────────────────────────────────────────────────────

  const nonRefunded   = orders.filter(o => (o.status ?? "").toLowerCase() !== "refunded");
  const netRevenue    = nonRefunded.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);
  const totalOrders   = orders.length;
  const publishedProds = products.filter(p => p.status === "published").length;
  const totalSales    = products.reduce((s, p) => s + (p.total_sales || 0), 0);

  const revenueByMonth = buildRevenueByMonth(orders);
  const maxRev = Math.max(...revenueByMonth.map(m => m.revenue), 1);

  const stats = [
    { label: "Net Revenue",   value: fmtK(netRevenue),              icon: IndianRupee, color: "emerald" },
    { label: "Total Orders",  value: totalOrders.toLocaleString(),  icon: ShoppingCart, color: "blue"   },
    { label: "Products",      value: publishedProds.toLocaleString(), icon: Package,   color: "purple"  },
    { label: "Total Sales",   value: totalSales.toLocaleString(),   icon: TrendingUp,  color: "amber"   },
  ];

  // Recent 4 orders normalised for display
  const recentOrders = orders.slice(0, 4).map(order => {
    const statusRaw = (order.status ?? "pending").toLowerCase();
    const statusLabel =
      statusRaw === "completed" ? "Completed" :
      statusRaw === "refunded"  ? "Refunded"  : "Processing";

    return {
      id:       `#${String(order.id).slice(0, 6).toUpperCase()}`,
      customer: order.shipping_address?.name ?? order.user_id?.slice(0, 8) ?? "—",
      product:  order.order_items?.[0]?.products?.name ?? order.order_items?.[0]?.product_name ?? "—",
      amount:   Number(order.total_amount ?? 0),
      status:   statusLabel,
      statusKey: statusRaw,
      time:     timeAgo(order.created_at),
    };
  });

  // Top 4 products for snapshot
  const topProducts = [...products]
    .sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))
    .slice(0, 4)
    .map(p => ({
      name:    p.name,
      status:  p.status === "published" ? "Active" : p.status === "draft" ? "Draft" : p.status,
      sales:   p.total_sales || 0,
      revenue: p.total_revenue || 0, // in paise
    }));

  const maxSales = Math.max(...topProducts.map(p => p.sales), 1);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const displayName = profile?.full_name?.split(" ")[0] ?? "Creator";

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div>
        {loading
          ? <Skeleton className="h-8 w-64 mb-2" />
          : <h2 className="text-xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-slate-700 bg-clip-text text-transparent">
              {greeting}, {displayName} 👋
            </h2>
        }
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          Failed to load dashboard data: {error}
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                <div className={`p-1.5 rounded-xl ${COLOR_BG[color]}`}>
                  <Icon className={`h-3.5 w-3.5 ${COLOR_TEXT[color]}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {loading
                ? <Skeleton className="h-8 w-20 mt-1" />
                : <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{value}</p>
              }
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Revenue chart + Quick actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Revenue chart */}
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Revenue Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                {loading ? "…" : fmtK(netRevenue)} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-5 pb-3 px-5">
            {loading
              ? <div className="flex items-end gap-2 h-28">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <Skeleton className="w-full" style={{ height: `${30 + i * 8}px` }} />
                      <Skeleton className="h-2 w-6" />
                    </div>
                  ))}
                </div>
              : <div className="flex items-end gap-2 h-28">
                  {revenueByMonth.map(({ month, revenue }) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 font-medium">
                        {revenue > 0 ? `₹${((revenue / 100) / 1000).toFixed(0)}k` : "—"}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all min-h-[4px]"
                        style={{ height: `${Math.max(Math.round((revenue / maxRev) * 80), 4)}px` }}
                      />
                      <span className="text-[9px] text-slate-400">{month}</span>
                    </div>
                  ))}
                </div>
            }
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900">Quick Actions</h3>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {[
              { label: "Add New Product",   desc: "Publish a digital product",   color: "blue",    href: "/dashboard/creator/products"  },
              { label: "View All Orders",   desc: "Check pending fulfillments",  color: "purple",  href: "/dashboard/creator/orders"    },
              { label: "Update Store Page", desc: "Edit branding & description", color: "amber",   href: "/dashboard/creator/settings"  },
              { label: "View Analytics",    desc: `${totalOrders} orders this period`, color: "emerald", href: "/dashboard/creator/analytics" },
            ].map(({ label, desc, color, href }) => (
              <a key={label} href={href} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group">
                <div className={`p-2 rounded-lg ${COLOR_BG[color]}`}>
                  <Zap className={`w-3.5 h-3.5 ${COLOR_TEXT[color]}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{label}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {loading ? "Loading…" : desc}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 ml-auto" />
              </a>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Recent orders + Products snapshot */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Recent orders */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Recent Orders</h3>
                <p className="text-xs text-slate-500 mt-0.5">Latest customer purchases</p>
              </div>
              <Clock className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}

            {!loading && recentOrders.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No orders yet.</p>
            )}

            {!loading && recentOrders.map(({ id, customer, product, amount, status, statusKey, time }) => (
              <div key={id} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl hover:bg-slate-50 transition-all">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0">
                  {id.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 text-sm">{id}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[statusKey] ?? "bg-slate-100 text-slate-600"}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{customer} · {product}</p>
                  <p className="text-[10px] text-slate-300">{time}</p>
                </div>
                <span className="font-bold text-slate-900 text-sm shrink-0">
                  ₹{(amount / 100).toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            {!loading && recentOrders.length > 0 && (
              <Link
                href="/dashboard/creator/orders"
                className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
              >
                Show More
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Products snapshot */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Products Snapshot</h3>
                <p className="text-xs text-slate-500 mt-0.5">Performance at a glance</p>
              </div>
              <Package className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 animate-pulse space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-1.5 w-full" />
              </div>
            ))}

            {!loading && topProducts.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No products yet.</p>
            )}

            {!loading && topProducts.map(({ name, status, sales, revenue }) => (
              <div key={name} className="p-2 sm:p-3 rounded-xl hover:bg-slate-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      status === "Active"   ? "bg-emerald-500 shadow-emerald-400/50 shadow-sm" :
                      status === "Sold Out" ? "bg-amber-400" : "bg-slate-300"
                    }`} />
                    <span className="font-medium text-slate-700 text-sm truncate">{name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-slate-900">
                      {fmtK(revenue)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      status === "Active"   ? "bg-emerald-100 text-emerald-700" :
                      status === "Sold Out" ? "bg-amber-100 text-amber-700"    : "bg-slate-100 text-slate-500"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                      style={{ width: `${Math.min((sales / maxSales) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 shrink-0">{sales} sales</span>
                </div>
              </div>
            ))}

            {!loading && topProducts.length > 0 && (
              <Link
                href="/dashboard/creator/products"
                className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
              >
                Show More
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}