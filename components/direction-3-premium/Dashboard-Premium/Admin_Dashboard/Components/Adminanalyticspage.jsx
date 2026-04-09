"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Globe, Store, AlertCircle } from "lucide-react";
import { getAccessToken } from "@/lib/utils/getAccessToken";

const CAT_COLORS = ["bg-blue-500","bg-purple-500","bg-violet-400","bg-indigo-400","bg-sky-400","bg-slate-300"];

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

function fmtL(paise) {
  return `₹${((paise / 100) / 100000).toFixed(2)}L`;
}

function fmtK(paise) {
  return `₹${((paise / 100) / 1000).toFixed(1)}k`;
}

function fmt(paise) {
  return (paise / 100).toLocaleString("en-IN");
}

export default function AdminAnalyticsPage() {
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

  const s               = data?.stats            ?? {};
  const monthlyData     = data?.monthlyData      ?? [];
  const revenueByCategory = data?.revenueByCategory ?? [];
  const topCountries    = data?.topCountries     ?? [];

  const maxGMV     = Math.max(...monthlyData.map(m => m.gmv), 1);
  const maxOrders  = Math.max(...monthlyData.map(m => m.orders), 1);
  const maxCreators = Math.max(...monthlyData.map(m => m.creators), 1);
  const totalCatRev = revenueByCategory.reduce((s, c) => s + c.revenue, 0);

  const totalGMV   = s.totalGMV   ?? 0;
  const totalFee   = s.totalFee   ?? 0;
  const avgOrder   = s.avgOrder   ?? 0;
  const refundRate = s.refundRate ?? '0.0';

  const kpis = [
    { label: "Total GMV",        value: fmtL(totalGMV), up: true  },
    { label: "Platform Revenue", value: fmtL(totalFee), up: true  },
    { label: "Avg Order Value",  value: `₹${fmt(avgOrder)}`,  up: true  },
    { label: "Refund Rate",      value: `${refundRate}%`,     up: false },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Platform Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Aggregated across all stores · {new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(({ label, value, up }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              {loading
                ? <Skeleton className="h-7 w-24 mt-1" />
                : <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
              }
              <div className="flex items-center gap-1 mt-0.5">
                {up
                  ? <TrendingUp  className="w-3 h-3 text-emerald-500" />
                  : <TrendingDown className="w-3 h-3 text-rose-500" />}
                <span className={`text-[10px] font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
                  {loading ? "—" : "platform total"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GMV & Creator Growth chart */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-slate-900">GMV & Creator Growth</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500"/><span className="text-slate-500">GMV</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-400"/><span className="text-slate-500">Active Creators</span></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 pb-4 px-5">
          {loading
            ? <div className="flex items-end gap-3 h-40 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-1 flex gap-1 items-end">
                    <Skeleton className="flex-1" style={{ height: `${30 + i * 14}px` }} />
                    <Skeleton className="flex-1" style={{ height: `${15 + i * 6}px` }} />
                  </div>
                ))}
              </div>
            : <>
                <div className="flex items-end gap-3 sm:gap-5 h-40">
                  {monthlyData.map(({ month, gmv, creators }) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex gap-1 items-end">
                        <div className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 min-h-[4px]"
                          style={{ height: `${Math.max(Math.round((gmv / maxGMV) * 120), 4)}px` }} />
                        <div className="flex-1 rounded-t-md bg-gradient-to-t from-purple-400 to-purple-300 min-h-[4px]"
                          style={{ height: `${Math.max(Math.round((creators / Math.max(maxCreators, 1)) * 120), 4)}px` }} />
                      </div>
                      <span className="text-[9px] text-slate-400">{month}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-3 mt-3 pt-3 border-t border-slate-100">
                  {monthlyData.map(({ month, gmv, creators }) => (
                    <div key={month} className="text-center">
                      <p className="text-[9px] text-slate-500 font-medium">{gmv > 0 ? fmtK(gmv) : "—"}</p>
                      <p className="text-[9px] text-slate-400">{creators} creators</p>
                    </div>
                  ))}
                </div>
              </>
          }
        </CardContent>
      </Card>

      {/* Category breakdown + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Revenue by product type */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-slate-400" />
              Revenue by Product Type
            </h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5 animate-pulse">
                <div className="flex justify-between"><Skeleton className="h-3 w-1/4" /><Skeleton className="h-3 w-16" /></div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}

            {!loading && revenueByCategory.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No sales data yet.</p>
            )}

            {!loading && revenueByCategory.map(({ name, revenue, pct }, i) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${CAT_COLORS[i % CAT_COLORS.length]}`} />
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">{fmtK(revenue)}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${CAT_COLORS[i % CAT_COLORS.length]} rounded-full transition-all`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}

            {!loading && revenueByCategory.length > 0 && (
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <span className="text-xs text-slate-400">Total GMV</span>
                <span className="text-sm font-bold text-slate-900">{fmtK(totalCatRev)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users by country */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              Users by Country
            </h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <Skeleton className="w-5 h-5 rounded-md shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-16" /></div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
              </div>
            ))}

            {!loading && topCountries.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                No country data yet. Add country fields to user profiles.
              </p>
            )}

            {!loading && topCountries.map(({ country, users, orders, pct }, i) => (
              <div key={country} className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-semibold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{country}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900">{users.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 ml-1">users</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">{orders.toLocaleString()} orders</p>
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