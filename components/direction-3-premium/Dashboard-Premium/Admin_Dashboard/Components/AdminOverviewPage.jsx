import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee, Users, ShoppingCart, AlertTriangle,
  TrendingUp, TrendingDown, Store, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle, Zap,
} from "lucide-react";
import { adminStats, adminStores, adminModeration, platformRevenueByMonth } from "@/app/data/Admindata";

const ICON_MAP = { IndianRupee, Users, ShoppingCart, AlertTriangle };
const COLOR_BG   = { emerald:"bg-emerald-50", blue:"bg-blue-50", purple:"bg-purple-50", amber:"bg-amber-50" };
const COLOR_TEXT = { emerald:"text-emerald-600", blue:"text-blue-600", purple:"text-purple-600", amber:"text-amber-600" };

const STORE_STATUS = {
  Active:    "bg-emerald-100 text-emerald-700",
  Suspended: "bg-rose-100 text-rose-700",
  Pending:   "bg-amber-100 text-amber-700",
};
const MOD_PRIORITY = {
  high:   "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low:    "bg-slate-100 text-slate-500",
};

export default function AdminOverviewPage() {
  const maxGMV = Math.max(...platformRevenueByMonth.map(m => m.gmv));
  const pendingItems = adminModeration.filter(m => m.status === "Pending" || m.status === "Open" || m.status === "Flagged");

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Premium Admin</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Platform Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Live dashboard · Jan 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {adminStats.map(({ label, value, trend, trendUp, color, icon }) => {
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
                  {trendUp
                    ? <TrendingUp className="w-3 h-3 text-emerald-500" />
                    : <TrendingDown className="w-3 h-3 text-rose-500" />}
                  <span className={`text-[8px] sm:text-[10px] font-semibold ${trendUp ? "text-emerald-600" : "text-rose-600"}`}>{trend}</span>
                  <span className="text-[8px] sm:text-[10px] text-slate-400">this month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* GMV Chart + Pending Actions */}
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
            <div className="flex items-end gap-3 h-32">
              {platformRevenueByMonth.map(({ month, gmv, fee }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex gap-1 items-end">
                    <div className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400"
                      style={{ height: `${Math.round((gmv / maxGMV) * 100)}px` }} />
                    <div className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400"
                      style={{ height: `${Math.round((fee / maxGMV) * 100)}px` }} />
                  </div>
                  <span className="text-[9px] text-slate-400">{month}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2 mt-3 pt-3 border-t border-slate-100">
              {platformRevenueByMonth.map(({ month, gmv, orders }) => (
                <div key={month} className="text-center">
                  <p className="text-[9px] text-slate-500 font-medium">₹{(gmv/100000).toFixed(1)}L</p>
                  <p className="text-[9px] text-slate-400">{orders} orders</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Needs Attention</h3>
              <Badge className="bg-rose-100 text-rose-700 border-0 text-xs">{pendingItems.length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-1">
            {pendingItems.map(({ id, type, subject, submittedBy, priority, status }) => (
              <div key={id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                  priority === "high" ? "bg-rose-500" : priority === "medium" ? "bg-amber-500" : "bg-slate-300"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{type}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${MOD_PRIORITY[priority]}`}>{priority}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 truncate mt-0.5">{subject}</p>
                  <p className="text-[10px] text-slate-400 truncate">by {submittedBy}</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 mt-1" />
              </div>
            ))}
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
                <p className="text-xs text-slate-500 mt-0.5">By revenue this month</p>
              </div>
              <Store className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="!p-0 sm:!px-2 space-y-1">
            {adminStores.slice(0, 5).map(({ id, name, owner, category, revenue, orders, status, rating }, i) => (
              <div key={id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className="text-xs text-slate-300 w-4 text-center shrink-0">{i + 1}</span>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                  <p className="text-[10px] text-slate-400">{owner} · {category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">₹{(revenue/1000).toFixed(0)}k</p>
                  <p className="text-[10px] text-slate-400">{orders} orders</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${STORE_STATUS[status]}`}>{status}</span>
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
            {[
              { id: "TXN-8821", user: "Riya Sharma",   product: "Signature Course", amount: 2499, status: "Settled"  },
              { id: "TXN-8820", user: "Aman Verma",    product: "UI Kit Pro",        amount: 1299, status: "Settled"  },
              { id: "TXN-8819", user: "Priya Mehta",   product: "Design Bundle",     amount: 1299, status: "Pending"  },
              { id: "TXN-8818", user: "Dev Kumar",     product: "Notion Kit",        amount: 799,  status: "Refunded" },
              { id: "TXN-8817", user: "Sneha Patil",   product: "Photo Pack",        amount: 599,  status: "Settled"  },
            ].map(({ id, user, product, amount, status }) => (
              <div key={id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-500 text-[10px] font-bold shrink-0">
                  {id.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user}</p>
                  <p className="text-[10px] text-slate-400 truncate">{product}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">₹{amount.toLocaleString()}</p>
                  <span className={`text-[10px] font-medium ${
                    status === "Settled" ? "text-emerald-600" :
                    status === "Pending" ? "text-amber-600" : "text-rose-600"
                  }`}>{status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}