"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CheckCircle2, Clock, XCircle, IndianRupee, TrendingUp, AlertCircle,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { getAccessToken } from "@/lib/utils/getAccessToken";

// ─── Config ───────────────────────────────────────────────────────────────────

const TX_STATUS = {
  Settled:  { style: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  Pending:  { style: "bg-amber-100   text-amber-700",   icon: Clock        },
  Refunded: { style: "bg-rose-100    text-rose-700",    icon: XCircle      },
};

const METHOD_STYLE = {
  UPI:        "bg-purple-50 text-purple-700",
  Card:       "bg-blue-50   text-blue-700",
  NetBanking: "bg-slate-100 text-slate-600",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

function fmt(paise) {
  return (paise / 100).toLocaleString("en-IN");
}

function fmtK(paise) {
  return `₹${((paise / 100) / 1000).toFixed(1)}k`;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const pages = new Set(
    [1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages)
  );
  const sorted = [...pages].sort((a, b) => a - b);

  // Build the items array with proper keys
  const items = [];
  sorted.forEach((p, i) => {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      items.push(
        <span key={`ellipsis-${p}`} className="text-xs text-slate-400 px-1">…</span>
      );
    }
    items.push(
      <button
        key={p}
        onClick={() => onPage(p)}
        className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
          p === page
            ? "bg-slate-900 text-white border border-slate-900"
            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        {p}
      </button>
    );
  });

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {items}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filter,   setFilter]   = useState("All");
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => { loadOrders(); }, []);

  // Reset to page 1 whenever filter or pageSize changes
  useEffect(() => { setPage(1); }, [filter, pageSize]);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);
      const token = await getAccessToken();
      const res = await fetch("/api/admin/orders", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

  // ── Derived stats ───────────────────────────────────────────────────────────

  const nonRefunded = orders.filter(o => o.status !== "Refunded");
  const totalGMV    = nonRefunded.reduce((s, o) => s + o.amount, 0);
  const totalFee    = nonRefunded.reduce((s, o) => s + o.fee,    0);
  const settled     = orders.filter(o => o.status === "Settled").length;
  const pending     = orders.filter(o => o.status === "Pending").length;
  const refunded    = orders.filter(o => o.status === "Refunded").length;

  // ── Pagination logic ────────────────────────────────────────────────────────

  const filtered   = filter === "All" ? orders : orders.filter(o => o.status === filter);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const visible    = filtered.slice((page - 1) * pageSize, page * pageSize);

  const fromRow = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const toRow   = Math.min(page * pageSize, filtered.length);

  const summaryCards = [
    { label: "Total GMV",    value: fmtK(totalGMV),      icon: IndianRupee, color: "emerald" },
    { label: "Platform Fee", value: `₹${fmt(totalFee)}`, icon: TrendingUp,  color: "blue"    },
    { label: "Pending",      value: pending,               icon: Clock,       color: "amber"   },
    { label: "Refunded",     value: refunded,              icon: XCircle,     color: "rose"    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Orders & Transactions</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {loading ? "Loading…" : `All platform transactions · ${orders.length} total`}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="!p-3 sm:!p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-${color}-50 shrink-0`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
                {loading
                  ? <Skeleton className="h-6 w-16 mt-0.5" />
                  : <p className="text-lg font-bold text-slate-900">{value}</p>
                }
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction table */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-slate-900">All Transactions</h3>
            <div className="flex gap-1.5 flex-wrap">
              {["All", "Settled", "Pending", "Refunded"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors ${
                    filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3 bg-slate-50/50 border-b border-slate-100">
            {["Order", "Buyer", "Creator", "Product", "Amount", "Fee", "Method", "Status"].map(h => (
              <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                  <Skeleton className="h-3 w-20 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2 w-1/4" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && visible.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-12">
              {filter === "All" ? "No orders found." : `No ${filter.toLowerCase()} orders.`}
            </p>
          )}

          {!loading && (
            <div className="divide-y divide-slate-100">
              {visible.map(txn => {
                const { style, icon: StatusIcon } = TX_STATUS[txn.status] ?? TX_STATUS.Pending;
                return (
                  <div key={txn.rawId} className="hover:bg-slate-50/60 transition-colors">

                    {/* Mobile */}
                    <div className="md:hidden p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className="font-mono text-xs font-semibold text-slate-500">{txn.id}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${style}`}>
                              {txn.status}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 truncate">{txn.product}</p>
                          <p className="text-[10px] text-slate-500 truncate">{txn.buyer} → {txn.creator}</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">{txn.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-slate-900">₹{fmt(txn.amount)}</p>
                          <p className="text-[10px] text-slate-400">fee: ₹{fmt(txn.fee)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 items-center px-5 py-3.5">
                      <p className="font-mono text-xs text-slate-500 truncate">{txn.id}</p>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 truncate">{txn.buyer}</p>
                        <p className="text-[10px] text-slate-400 truncate">{txn.buyerEmail}</p>
                      </div>
                      <p className="text-sm text-slate-700 truncate">{txn.creator}</p>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-600 truncate">{txn.product}</p>
                        {txn.itemCount > 1 && (
                          <p className="text-[10px] text-slate-400">+{txn.itemCount - 1} more items</p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">₹{fmt(txn.amount)}</p>
                      <p className="text-sm text-emerald-600 font-medium">₹{fmt(txn.fee)}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${METHOD_STYLE[txn.method] ?? "bg-slate-100 text-slate-600"}`}>
                        {txn.method}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium w-fit ${style}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {txn.status}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Footer — totals + pagination */}
          {!loading && filtered.length > 0 && (() => {
            const nonRef = filtered.filter(o => o.status !== "Refunded");
            const visGMV = nonRef.reduce((s, o) => s + o.amount, 0);
            const visFee = nonRef.reduce((s, o) => s + o.fee,    0);
            return (
              <>
                {/* Totals row (desktop only) */}
                <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3 bg-slate-50 border-t border-slate-200">
                  <p className="text-[10px] font-semibold text-slate-500 col-span-4">
                    Totals ({filtered.length} transaction{filtered.length !== 1 ? "s" : ""})
                  </p>
                  <p className="text-sm font-bold text-slate-900">₹{fmt(visGMV)}</p>
                  <p className="text-sm font-bold text-emerald-600">₹{fmt(visFee)}</p>
                  <div /><div />
                </div>

                {/* Pagination bar */}
                <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-t border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-xs text-slate-500">
                      Showing {fromRow}–{toRow} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400">Rows</label>
                      <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700"
                      >
                        {PAGE_SIZE_OPTIONS.map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                </div>
              </>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}