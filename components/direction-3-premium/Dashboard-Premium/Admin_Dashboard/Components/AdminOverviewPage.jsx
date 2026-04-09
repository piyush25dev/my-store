"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee, Users, ShoppingCart, AlertTriangle,
  TrendingUp, TrendingDown, Store, ArrowUpRight, Clock,
  AlertCircle, Loader,
} from "lucide-react";
import { getAccessToken } from "@/lib/utils/getAccessToken";

// ─── Config ───────────────────────────────────────────────────────────────────

const COLOR_BG   = { emerald:"bg-emerald-50", blue:"bg-blue-50", purple:"bg-purple-50", amber:"bg-amber-50" };
const COLOR_TEXT = { emerald:"text-emerald-600", blue:"text-blue-600", purple:"text-purple-600", amber:"text-amber-600" };

const STORE_STATUS = {
  Active:  "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100   text-amber-700",
};

const TX_STATUS_COLOR = {
  Settled:  "text-emerald-600",
  Pending:  "text-amber-600",
  Refunded: "text-rose-600",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

function fmtL(paise) {
  return `₹${((paise / 100) / 100000).toFixed(1)}L`;
}

function fmtK(paise) {
  return `₹${((paise / 100) / 1000).toFixed(1)}k`;
}

function fmt(paise) {
  return (paise / 100).toLocaleString("en-IN");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    try {
      setLoading(true); setError(null);
      const token = await getAccessToken();
      const res = await fetch("/api/admin/stats", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch stats");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const s            = data?.stats            ?? {};
  const monthlyData  = data?.monthlyData      ?? [];
  const topStores    = data?.topStores        ?? [];
  const recentTx     = data?.recentTransactions ?? [];

  const maxGMV = Math.max(...monthlyData.map(m => m.gmv), 1);

  const overviewCards = [
    { label: "Total GMV",       value: fmtL(s.totalGMV ?? 0),          color: "emerald", icon: IndianRupee  },
    { label: "Total Creators",  value: s.totalCreators ?? 0,            color: "blue",    icon: Store        },
    { label: "Total Users",     value: s.totalCustomers ?? 0,           color: "purple",  icon: Users        },
    { label: "Total Orders",    value: s.totalOrders ?? 0,              color: "amber",   icon: ShoppingCart },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Admin</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Platform Overview</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {loading ? "Loading…" : `Live dashboard · ${new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">All systems operational</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* Stats cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {overviewCards.map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 hover:scale-[1.02]">
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
                ? <Skeleton className="h-8 w-24 mt-1" />
                : <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{value}</p>
              }
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-slate-400">platform total</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* GMV Chart + Pending creators */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* GMV Chart */}
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-slate-900">Gross Merchandise Value</h3>
                <p className="text-xs text-slate-500 mt-0.5">Platform GMV vs Platform Fee earned</p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500"/><span className="text-slate-500">GMV</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-400"/><span className="text-slate-500">Platform Fee</span></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 pb-3 px-5">
            {loading
              ? <div className="flex items-end gap-3 h-32">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-1 flex gap-1 items-end animate-pulse">
                      <Skeleton className="flex-1" style={{ height: `${40 + i * 10}px` }} />
                      <Skeleton className="flex-1" style={{ height: `${10 + i * 4}px` }} />
                    </div>
                  ))}
                </div>
              : <>
                  <div className="flex items-end gap-3 h-32">
                    {monthlyData.map(({ month, gmv, fee }) => (
                      <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full flex gap-1 items-end">
                          <div className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 min-h-[4px]"
                            style={{ height: `${Math.max(Math.round((gmv / maxGMV) * 100), 4)}px` }} />
                          <div className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 min-h-[4px]"
                            style={{ height: `${Math.max(Math.round((fee / maxGMV) * 100), 4)}px` }} />
                        </div>
                        <span className="text-[9px] text-slate-400">{month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-6 gap-2 mt-3 pt-3 border-t border-slate-100">
                    {monthlyData.map(({ month, gmv, orders }) => (
                      <div key={month} className="text-center">
                        <p className="text-[9px] text-slate-500 font-medium">
                          {gmv > 0 ? fmtK(gmv) : "—"}
                        </p>
                        <p className="text-[9px] text-slate-400">{orders} orders</p>
                      </div>
                    ))}
                  </div>
                </>
            }
          </CardContent>
        </Card>

        {/* Needs Attention — pending creators */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Needs Attention</h3>
              {loading
                ? <Skeleton className="h-5 w-16 rounded-full" />
                : <Badge className="bg-rose-100 text-rose-700 border-0 text-xs">
                    {s.pendingCreators ?? 0} pending
                  </Badge>
              }
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-1">
            {loading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-2.5 animate-pulse">
                <Skeleton className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-2 w-16" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}

            {!loading && s.pendingCreators === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">Nothing pending 🎉</p>
            )}

            {!loading && s.pendingCreators > 0 && (
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Creator Review</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">medium</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {s.pendingCreators} creator{s.pendingCreators !== 1 ? "s" : ""} awaiting verification
                  </p>
                  <p className="text-[10px] text-slate-400">Review and approve in Creators tab</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 mt-1" />
              </div>
            )}

            {/* Platform fee summary */}
            {!loading && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">Platform Revenue</p>
                <p className="text-lg font-bold text-emerald-700">{fmtL(s.totalFee ?? 0)}</p>
                <p className="text-[10px] text-emerald-500">from {s.totalOrders ?? 0} orders · 5% fee</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Top Stores + Recent Transactions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Top Stores */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Top Stores</h3>
                <p className="text-xs text-slate-500 mt-0.5">By revenue · all time</p>
              </div>
              <Store className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:px-2 pt-1 space-y-0.5">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 animate-pulse">
                <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-2 w-1/4" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}

            {!loading && topStores.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No store data yet.</p>
            )}

            {!loading && topStores.map(({ id, name, owner, revenue, orders, status }, i) => (
              <div key={id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className="text-xs text-slate-300 w-4 text-center shrink-0">{i + 1}</span>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{owner}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">{fmtK(revenue)}</p>
                  <p className="text-[10px] text-slate-400">{orders} orders</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${STORE_STATUS[status] ?? "bg-slate-100 text-slate-500"}`}>
                  {status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
                <p className="text-xs text-slate-500 mt-0.5">Across all stores</p>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-1">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 animate-pulse">
                <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-2 w-10" />
                </div>
              </div>
            ))}

            {!loading && recentTx.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No transactions yet.</p>
            )}

            {!loading && recentTx.map(({ id, txnId, user, product, amount, status }) => (
              <div key={id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-500 text-[10px] font-bold shrink-0">
                  {txnId.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user}</p>
                  <p className="text-[10px] text-slate-400 truncate">{product}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">₹{fmt(amount)}</p>
                  <span className={`text-[10px] font-medium ${TX_STATUS_COLOR[status] ?? "text-slate-500"}`}>
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}