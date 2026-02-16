import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee, ShoppingCart, Package, TrendingUp,
  Clock, CheckCircle2, XCircle, ArrowUpRight, Zap,
} from "lucide-react";
import {
  creatorStats, creatorOrders, creatorProducts, revenueByMonth,
} from "@/app/data/Dashboard";

const ICON_MAP = { IndianRupee, ShoppingCart, Package, TrendingUp };
const COLOR_BG  = { emerald:"bg-emerald-50", blue:"bg-blue-50", purple:"bg-purple-50", amber:"bg-amber-50" };
const COLOR_TEXT= { emerald:"text-emerald-600", blue:"text-blue-600", purple:"text-purple-600", amber:"text-amber-600" };

const statusStyle = {
  Completed:  "bg-emerald-100 text-emerald-700",
  Processing: "bg-amber-100 text-amber-700",
  Refunded:   "bg-rose-100 text-rose-700",
};

export default function OverviewPage() {
  const maxRev = Math.max(...revenueByMonth.map(m => m.revenue));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-slate-700 bg-clip-text text-transparent">
          Good morning, Piyush 👋
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {creatorStats.map(({ label, value, icon, trend, trendUp, color }) => {
          const Icon = ICON_MAP[icon];
          return (
            <Card key={label} className="border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                  <div className={`p-1.5 rounded-xl ${COLOR_BG[color]}`}>
                    <Icon className={`h-3.5 w-3.5 ${COLOR_TEXT[color]}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1">
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{value}</p>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className={`w-3 h-3 ${trendUp ? "text-emerald-500" : "text-rose-500"}`} />
                  <span className={`text-[8px] sm:text-[10px] font-semibold ${trendUp ? "text-emerald-600" : "text-rose-600"}`}>{trend}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400">this month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Revenue Sparkline + Quick actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Revenue Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">+18.2% avg</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-5 pb-3 px-5">
            <div className="flex items-end gap-2 h-28">
              {revenueByMonth.map(({ month, revenue }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-slate-400 font-medium">
                    ₹{(revenue / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all"
                    style={{ height: `${Math.round((revenue / maxRev) * 80)}px` }}
                  />
                  <span className="text-[9px] text-slate-400">{month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900">Quick Actions</h3>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {[
              { label: "Add New Product",   desc: "Publish a digital product",   color: "blue"   },
              { label: "View All Orders",   desc: "Check pending fulfillments",  color: "purple" },
              { label: "Manage Payouts",    desc: "₹18,420 pending payout",      color: "emerald"},
              { label: "Update Store Page", desc: "Edit branding & description", color: "amber"  },
            ].map(({ label, desc, color }) => (
              <button key={label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group">
                <div className={`p-2 rounded-lg ${COLOR_BG[color]}`}>
                  <Zap className={`w-3.5 h-3.5 ${COLOR_TEXT[color]}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{desc}</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 ml-auto" />
              </button>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Recent orders + Products snapshot */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Orders */}
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
            {creatorOrders.slice(0, 5).map(({ id, customer, product, amount, status, time }) => (
              <div key={id} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl hover:bg-slate-50 transition-all">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0">
                  {id.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 text-sm">{id}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[status] ?? "bg-slate-100 text-slate-600"}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{customer} · {product}</p>
                  <p className="text-[10px] text-slate-300">{time}</p>
                </div>
                <span className="font-bold text-slate-900 text-sm shrink-0">₹{amount.toLocaleString()}</span>
              </div>
            ))}
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
            {creatorProducts.slice(0, 4).map(({ name, status, sales, revenue }) => (
              <div key={name} className="p-2 sm:p-3 rounded-xl hover:bg-slate-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${status === "Active" ? "bg-emerald-500 shadow-emerald-400/50 shadow-sm" : status === "Sold Out" ? "bg-amber-400" : "bg-slate-300"}`} />
                    <span className="font-medium text-slate-700 text-sm truncate">{name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-slate-900">₹{(revenue/1000).toFixed(0)}k</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      status === "Active" ? "bg-emerald-100 text-emerald-700" :
                      status === "Sold Out" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                      {status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      style={{ width: `${Math.min((sales / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 shrink-0">{sales} sales</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}