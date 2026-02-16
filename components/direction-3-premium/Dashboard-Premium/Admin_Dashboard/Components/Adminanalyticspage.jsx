import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Globe, BarChart2, Store, Users } from "lucide-react";
import { platformRevenueByMonth, revenueByCategory, platformTopCountries } from "@/app/data/Admindata";

const CAT_COLORS = ["bg-blue-500","bg-purple-500","bg-violet-400","bg-indigo-400","bg-sky-400","bg-slate-300"];

export default function AdminAnalyticsPage() {
  const maxGMV     = Math.max(...platformRevenueByMonth.map(m => m.gmv));
  const maxCreators= Math.max(...platformRevenueByMonth.map(m => m.creators));
  const totalGMV   = revenueByCategory.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Platform Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">Aggregated across all stores · Jan 2025</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total GMV",       value: "₹48.2L",  change: "+22.4%", up: true  },
          { label: "Platform Revenue",value: "₹3.86L",  change: "+22.4%", up: true  },
          { label: "Avg Order Value", value: "₹2,610",  change: "+8.1%",  up: true  },
          { label: "Refund Rate",     value: "3.2%",    change: "-0.4%",  up: false },
        ].map(({ label, value, change, up }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {up ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                <span className={`text-[10px] font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>{change}</span>
                <span className="text-[10px] text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GMV + Creator Growth chart */}
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
          <div className="flex items-end gap-3 sm:gap-5 h-40">
            {platformRevenueByMonth.map(({ month, gmv, creators }) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex gap-1 items-end">
                  <div className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400"
                    style={{ height: `${Math.round((gmv / maxGMV) * 120)}px` }} />
                  <div className="flex-1 rounded-t-md bg-gradient-to-t from-purple-400 to-purple-300"
                    style={{ height: `${Math.round((creators / maxCreators) * 120)}px` }} />
                </div>
                <span className="text-[9px] text-slate-400">{month}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-3 mt-3 pt-3 border-t border-slate-100">
            {platformRevenueByMonth.map(({ month, gmv, creators, orders }) => (
              <div key={month} className="text-center">
                <p className="text-[9px] text-slate-500 font-medium">₹{(gmv/100000).toFixed(1)}L</p>
                <p className="text-[9px] text-slate-400">{creators} creators</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category breakdown + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category revenue */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-slate-400" />
              Revenue by Category
            </h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {revenueByCategory.map(({ name, revenue, pct }, i) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${CAT_COLORS[i]}`} />
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">₹{(revenue/100000).toFixed(1)}L</span>
                    <span className="text-[10px] text-slate-400 ml-2">{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${CAT_COLORS[i]} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100 flex justify-between">
              <span className="text-xs text-slate-400">Total GMV</span>
              <span className="text-sm font-bold text-slate-900">₹{(totalGMV/100000).toFixed(1)}L</span>
            </div>
          </CardContent>
        </Card>

        {/* Top countries */}
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              Users by Country
            </h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {platformTopCountries.map(({ country, users, orders, pct }, i) => (
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
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${pct}%` }} />
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