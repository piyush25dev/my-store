import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Globe, BarChart2, ShoppingBag } from "lucide-react";
import { revenueByMonth, revenueByProduct, topCountries, creatorStats } from "@/app/data/Dashboard";

const BAR_COLORS = ["bg-blue-500", "bg-purple-500", "bg-violet-400", "bg-indigo-300", "bg-blue-300"];

export default function AnalyticsPage() {
  const maxRev = Math.max(...revenueByMonth.map(m => m.revenue));
  const maxOrders = Math.max(...revenueByMonth.map(m => m.orders));
  const totalRevenue = revenueByProduct.reduce((s, p) => s + p.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">Performance overview · Jan 2025</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:"Total Revenue",  value:"₹3,42,000", change:"+18.2%", up:true  },
          { label:"Total Orders",   value:"612",        change:"+45",    up:true  },
          { label:"Avg Order Value",value:"₹1,720",     change:"+4.1%",  up:true  },
          { label:"Refund Rate",    value:"3.2%",       change:"-0.4%",  up:false },
        ].map(({ label, value, change, up }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {up
                  ? <TrendingUp className="w-3 h-3 text-emerald-500" />
                  : <TrendingDown className="w-3 h-3 text-rose-500" />}
                <span className={`text-[10px] font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>{change}</span>
                <span className="text-[10px] text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-slate-900">Revenue & Orders</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500" /><span className="text-slate-500">Revenue</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-400" /><span className="text-slate-500">Orders</span></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-end gap-3 sm:gap-5 h-40">
            {revenueByMonth.map(({ month, revenue, orders }) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex gap-1 items-end">
                  <div
                    className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400"
                    style={{ height: `${Math.round((revenue / maxRev) * 120)}px` }}
                  />
                  <div
                    className="flex-1 rounded-t-md bg-gradient-to-t from-purple-400 to-purple-300"
                    style={{ height: `${Math.round((orders / maxOrders) * 120)}px` }}
                  />
                </div>
                <span className="text-[9px] text-slate-400">{month}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-3 mt-3 pt-3 border-t border-slate-100">
            {revenueByMonth.map(({ month, revenue, orders }) => (
              <div key={month} className="text-center">
                <p className="text-[9px] text-slate-500 font-medium">₹{(revenue/1000).toFixed(0)}k</p>
                <p className="text-[9px] text-slate-400">{orders} orders</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product breakdown + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Product revenue */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              Revenue by Product
            </h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {revenueByProduct.map(({ name, revenue, pct }, i) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${BAR_COLORS[i]}`} />
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">₹{(revenue/1000).toFixed(0)}k</span>
                    <span className="text-[10px] text-slate-400 ml-2">{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${BAR_COLORS[i]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100 flex justify-between">
              <span className="text-xs text-slate-400">Total</span>
              <span className="text-sm font-bold text-slate-900">₹{(totalRevenue/100000).toFixed(1)}L</span>
            </div>
          </CardContent>
        </Card>

        {/* Top countries */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              Customers by Country
            </h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {topCountries.map(({ country, orders, pct }, i) => (
              <div key={country} className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-semibold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{country}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900">{orders}</span>
                      <span className="text-[10px] text-slate-400 ml-1">orders</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${pct}%` }} />
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