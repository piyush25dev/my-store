import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
} from "lucide-react";
import { creatorOrders } from "@/app/data/Dashboard";

const statusConfig = {
  Completed: { style: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  Processing: { style: "bg-amber-100 text-amber-700", icon: Clock },
  Refunded: { style: "bg-rose-100 text-rose-700", icon: XCircle },
};

export default function OrdersPage() {
  const total = creatorOrders.reduce(
    (s, o) => s + (o.status !== "Refunded" ? o.amount : 0),
    0,
  );
  const completed = creatorOrders.filter(
    (o) => o.status === "Completed",
  ).length;
  const refunded = creatorOrders.filter((o) => o.status === "Refunded").length;
  const pending = creatorOrders.filter((o) => o.status === "Processing").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Orders
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {creatorOrders.length} orders total
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Net Revenue",
            value: `₹${(total / 1000).toFixed(1)}k`,
            icon: IndianRupee,
            color: "emerald",
          },
          {
            label: "Completed",
            value: completed,
            icon: CheckCircle2,
            color: "blue",
          },
          { label: "Processing", value: pending, icon: Clock, color: "amber" },
          { label: "Refunded", value: refunded, icon: XCircle, color: "rose" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card
            key={label}
            className="border-slate-200/60 bg-white/90 shadow-sm"
          >
            <CardContent className="!p-1 sm:!p-4 flex items-center justify-center gap-3">
              <div className={`p-2 rounded-xl bg-${color}-50`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider pt-2">
                  {label}
                </p>
                <p className="text-lg font-bold text-slate-900">{value}</p>
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
              {["All", "Completed", "Processing", "Refunded"].map((f) => (
                <button
                  key={f}
                  className={`
      flex-shrink-0
      text-[10px] px-3 py-1.5 rounded-full font-medium
      transition-colors whitespace-nowrap
      ${
        f === "All"
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }
    `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            {["Order", "Customer", "Product", "Amount", "Status", "Date"].map(
              (h) => (
                <p
                  key={h}
                  className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </p>
              ),
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {creatorOrders.map((order) => {
              const { style, icon: StatusIcon } =
                statusConfig[order.status] ?? {};
              return (
                <div
                  key={order.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Mobile */}
                  <div className="sm:hidden p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-slate-900 text-sm">
                            {order.id}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${style}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {order.customer}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {order.product}
                        </p>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          {order.date}
                        </p>
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
                      <p className="font-semibold text-slate-900 text-sm">
                        {order.id}
                      </p>
                    </div>
                    <p className="text-sm text-slate-700 truncate">
                      {order.customer}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {order.product}
                    </p>
                    <p className="font-semibold text-slate-900 text-sm">
                      ₹{order.amount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium w-fit ${style}`}
                    >
                      <StatusIcon className="w-2.5 h-2.5" />
                      {order.status}
                    </span>
                    <p className="text-xs text-slate-400">{order.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
