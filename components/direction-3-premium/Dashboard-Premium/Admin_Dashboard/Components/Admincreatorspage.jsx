import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, TrendingUp, IndianRupee, Package, MoreHorizontal, CheckCircle2, XCircle, Clock } from "lucide-react";
import { adminCreators } from "@/app/data/Admindata";

const STATUS_STYLE = {
  Active:    "bg-emerald-100 text-emerald-700",
  Suspended: "bg-rose-100 text-rose-700",
  Pending:   "bg-amber-100 text-amber-700",
};
const STATUS_ICON = { Active: CheckCircle2, Suspended: XCircle, Pending: Clock };

const AVATAR_COLORS = [
  "from-blue-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-violet-500 to-purple-700",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-cyan-600",
  "from-red-500 to-rose-700",
];

export default function AdminCreatorsPage() {
  const active    = adminCreators.filter(c => c.status === "Active").length;
  const pending   = adminCreators.filter(c => c.status === "Pending").length;
  const suspended = adminCreators.filter(c => c.status === "Suspended").length;
  const totalRev  = adminCreators.reduce((s, c) => s + c.revenue, 0);
  const totalPendingPayout = adminCreators.reduce((s, c) => s + c.payoutPending, 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Creators</h2>
          <p className="text-xs text-slate-500 mt-0.5">{adminCreators.length} total · {active} active · {pending} pending review</p>
        </div>
        <Button className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 text-sm self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          Invite Creator
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total",          value: adminCreators.length,                       color: "slate"   },
          { label: "Active",         value: active,                                     color: "emerald" },
          { label: "Pending",        value: pending,                                    color: "amber"   },
          { label: "Suspended",      value: suspended,                                  color: "rose"    },
          { label: "Payout Queue",   value: `₹${(totalPendingPayout/1000).toFixed(0)}k`, color: "blue"  },
        ].map(({ label, value, color }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
              <p className={`text-lg font-bold mt-0.5 text-${color === "slate" ? "slate-900" : `${color}-600`}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-slate-900">All Creators</h3>
            <div className="flex gap-1.5">
              {["All", "Active", "Pending", "Suspended"].map(f => (
                <button key={f} className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors ${
                  f === "All" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>{f}</button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">

          {/* Desktop header */}
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50/50 border-b border-slate-100">
            {["Creator","Contact","Products","Revenue","Orders","Status",""].map(h => (
              <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {adminCreators.map((c, i) => {
              const StatusIcon = STATUS_ICON[c.status];
              return (
                <div key={c.id} className="group hover:bg-slate-50/60 transition-colors">

                  {/* Mobile */}
                  <div className="lg:hidden p-0 py-4 sm:p-4  space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                        {c.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[c.status]}`}>{c.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{c.handle} · {c.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><p className="text-[10px] text-slate-400">Revenue</p><p className="text-sm font-bold text-slate-900">₹{(c.revenue/1000).toFixed(0)}k</p></div>
                      <div><p className="text-[10px] text-slate-400">Orders</p><p className="text-sm font-bold text-slate-900">{c.orders}</p></div>
                      <div><p className="text-[10px] text-slate-400">Products</p><p className="text-sm font-bold text-slate-900">{c.products}</p></div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {c.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.handle} · {c.joined}</p>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 truncate">{c.email}</p>
                      <p className="text-[10px] text-slate-400">{c.country}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{c.products}</p>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">₹{(c.revenue/1000).toFixed(0)}k</p>
                      {c.payoutPending > 0 && (
                        <p className="text-[10px] text-amber-600">₹{(c.payoutPending/1000).toFixed(1)}k pending</p>
                      )}
                    </div>
                    <p className="text-sm text-slate-700">{c.orders}</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium w-fit ${STATUS_STYLE[c.status]}`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {c.status}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
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