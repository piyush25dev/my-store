import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CheckCircle2, Clock, XCircle, IndianRupee, TrendingUp } from "lucide-react";
import { adminTransactions } from "@/app/data/Admindata";

const TX_STATUS = {
  Settled:  { style: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  Pending:  { style: "bg-amber-100 text-amber-700",     icon: Clock        },
  Refunded: { style: "bg-rose-100 text-rose-700",       icon: XCircle      },
};

const METHOD_STYLE = {
  UPI:        "bg-purple-50 text-purple-700",
  Card:       "bg-blue-50 text-blue-700",
  NetBanking: "bg-slate-100 text-slate-600",
};

export default function AdminOrdersPage() {
  const totalGMV     = adminTransactions.reduce((s, t) => s + (t.status !== "Refunded" ? t.amount : 0), 0);
  const totalFee     = adminTransactions.reduce((s, t) => s + (t.status !== "Refunded" ? t.fee : 0), 0);
  const settled      = adminTransactions.filter(t => t.status === "Settled").length;
  const pending      = adminTransactions.filter(t => t.status === "Pending").length;
  const refunded     = adminTransactions.filter(t => t.status === "Refunded").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Orders & Transactions</h2>
        <p className="text-xs text-slate-500 mt-0.5">All platform transactions · {adminTransactions.length} shown</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total GMV",       value: `₹${(totalGMV/1000).toFixed(1)}k`, icon: IndianRupee, color: "emerald" },
          { label: "Platform Fee",    value: `₹${totalFee.toLocaleString()}`,     icon: TrendingUp,  color: "blue"    },
          { label: "Pending",         value: pending,                             icon: Clock,       color: "amber"   },
          { label: "Refunded",        value: refunded,                            icon: XCircle,     color: "rose"    },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="!p-1 sm:!p-4 flex items-center justify-center gap-3">
              <div className={`p-2 rounded-xl bg-${color}-50 shrink-0`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-lg font-bold text-slate-900">{value}</p>
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
            <div className="flex gap-1.5">
              {["All", "Settled", "Pending", "Refunded"].map(f => (
                <button key={f} className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors ${
                  f === "All" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>{f}</button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3 bg-slate-50/50 border-b border-slate-100">
            {["TXN ID","Buyer","Creator","Product","Amount","Fee","Method","Status"].map(h => (
              <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {adminTransactions.map((txn) => {
              const { style, icon: StatusIcon } = TX_STATUS[txn.status] ?? {};
              return (
                <div key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Mobile */}
                  <div className="md:hidden p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-mono text-xs font-semibold text-slate-500">{txn.id}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${style}`}>{txn.status}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{txn.product}</p>
                        <p className="text-[10px] text-slate-400">{txn.user} → {txn.creator}</p>
                        <p className="text-[10px] text-slate-300 mt-0.5">{txn.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-slate-900">₹{txn.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">fee: ₹{txn.fee}</p>
                      </div>
                    </div>
                  </div>
                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 items-center px-5 py-3">
                    <p className="font-mono text-xs text-slate-500">{txn.id}</p>
                    <p className="text-sm text-slate-700 truncate">{txn.user}</p>
                    <p className="text-sm text-slate-700 truncate">{txn.creator}</p>
                    <p className="text-sm text-slate-600 truncate">{txn.product}</p>
                    <p className="text-sm font-semibold text-slate-900">₹{txn.amount.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">₹{txn.fee}</p>
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

          {/* Footer totals */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-[10px] font-semibold text-slate-500 col-span-4">Totals ({adminTransactions.length} transactions)</p>
            <p className="text-sm font-bold text-slate-900">₹{totalGMV.toLocaleString()}</p>
            <p className="text-sm font-bold text-emerald-600">₹{totalFee.toLocaleString()}</p>
            <div />
            <div />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}