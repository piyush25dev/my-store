"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, IndianRupee } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";

const statusConfig = {
  completed:  { style: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  pending:    { style: "bg-amber-100  text-amber-700",    icon: Clock        },
  processing: { style: "bg-amber-100  text-amber-700",    icon: Clock        },
  refunded:   { style: "bg-rose-100   text-rose-700",     icon: XCircle      },
};

function normaliseOrder(order) {
  const productName = order.order_items?.[0]?.products?.name ?? "—";
  const statusRaw   = (order.status ?? "pending").toLowerCase();
  const statusLabel =
    statusRaw === "completed" ? "Completed" :
    statusRaw === "refunded"  ? "Refunded"  : "Processing";

  return {
    id:       `#${String(order.id).slice(0, 6).toUpperCase()}`,
    rawId:    order.id,
    customer: order.shipping_address?.name ?? order.user_id?.slice(0, 8) ?? "—",
    product:  productName,
    amount:   Number(order.total_amount ?? 0),
    status:   statusLabel,
    date:     new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              }),
  };
}

export default function OrdersPage() {
  const { orders: rawOrders, loading, error } = useOrders();
  const [filter, setFilter] = useState("All");

  const orders  = rawOrders.map(normaliseOrder);
  const visible = filter === "All" ? orders : orders.filter(o => o.status === filter);

  const total     = orders.reduce((s, o) => s + (o.status !== "Refunded" ? o.amount : 0), 0);
  const completed = orders.filter(o => o.status === "Completed").length;
  const refunded  = orders.filter(o => o.status === "Refunded").length;
  const pending   = orders.filter(o => o.status === "Processing").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Orders</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {loading ? "Loading…" : `${orders.length} orders total`}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          Failed to load orders: {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Net Revenue", value: `₹${(total / 1000).toFixed(1)}k`, icon: IndianRupee, color: "emerald" },
          { label: "Completed",   value: completed,                          icon: CheckCircle2, color: "blue"   },
          { label: "Processing",  value: pending,                            icon: Clock,        color: "amber"  },
          { label: "Refunded",    value: refunded,                           icon: XCircle,      color: "rose"   },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="!p-1 sm:!p-4 flex items-center justify-center gap-3">
              <div className={`p-2 rounded-xl bg-${color}-50`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider pt-2">{label}</p>
                <p className="text-lg font-bold text-slate-900">
                  {loading ? "…" : value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders table */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">All Orders</h3>
            <div className="flex flex-wrap gap-2">
              {["All", "Completed", "Processing", "Refunded"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`
                    flex-shrink-0 text-[10px] px-3 py-1.5 rounded-full font-medium
                    transition-colors whitespace-nowrap
                    ${filter === f
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"}
                  `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="hidden sm:grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            {["Order", "Customer", "Product", "Amount", "Status", "Date"].map(h => (
              <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-12">No orders found.</p>
          )}

          {!loading && (
            <div className="divide-y divide-slate-100">
              {visible.map(order => {
                const { style, icon: StatusIcon } = statusConfig[order.status.toLowerCase()] ?? {};
                return (
                  <div key={order.rawId} className="hover:bg-slate-50/60 transition-colors">

                    {/* Mobile */}
                    <div className="sm:hidden p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-slate-900 text-sm">{order.id}</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${style}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{order.customer}</p>
                          <p className="text-[10px] text-slate-400">{order.product}</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">{order.date}</p>
                        </div>
                        <p className="font-bold text-slate-900 text-sm shrink-0">
                          ₹{order.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden sm:grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] gap-4 items-center px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {order.id.slice(-2)}
                        </div>
                        <p className="font-semibold text-slate-900 text-sm">{order.id}</p>
                      </div>
                      <p className="text-sm text-slate-700 truncate">{order.customer}</p>
                      <p className="text-sm text-slate-500 truncate">{order.product}</p>
                      <p className="font-semibold text-slate-900 text-sm">₹{order.amount.toLocaleString()}</p>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium w-fit ${style}`}>
                        {StatusIcon && <StatusIcon className="w-2.5 h-2.5" />}
                        {order.status}
                      </span>
                      <p className="text-xs text-slate-400">{order.date}</p>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}