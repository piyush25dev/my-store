import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IndianRupee, ShoppingCart, Package, TrendingUp, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function CreatorDashboard() {
  const stats = [
    { label: "Revenue", value: "₹3,42,000", icon: IndianRupee, trend: "+18.2%", color: "text-emerald-600" },
    { label: "Orders", value: "612", icon: ShoppingCart, trend: "+45", color: "text-blue-600" },
    { label: "Products", value: "14", icon: Package, trend: "+2", color: "text-purple-600" },
    { label: "Conversion", value: "3.8%", icon: TrendingUp, trend: "+0.5%", color: "text-amber-600" },
  ];

  const recentOrders = [
    { id: "#1042", amount: "₹2,499", status: "Completed", time: "2 hours ago" },
    { id: "#1041", amount: "₹799", status: "Processing", time: "5 hours ago" },
    { id: "#1040", amount: "₹1,299", status: "Completed", time: "1 day ago" },
  ];

  const products = [
    { name: "Signature Course", status: "Active", sales: 284 },
    { name: "Notion Kit", status: "Sold Out", sales: 156 },
    { name: "Design Bundle", status: "Active", sales: 92 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-0 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-slate-700 bg-clip-text text-transparent">
            Creator Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Track your performance and manage your business</p>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(({ label, value, icon: Icon, trend, color }) => (
            <Card key={label} className="border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                  <div className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-br ${color.replace('text-', 'from-')}/10 ${color.replace('text-', 'to-')}/5 shadow-sm`}>
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] sm:text-xs font-semibold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400">this month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Recent Orders</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Latest customer purchases</p>
                </div>
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              {recentOrders.map(({ id, amount, status, time }) => (
                <div key={id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                      {id.slice(-2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base">{id}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {status === 'Completed' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                          {status}
                        </span>
                        <span className="text-[10px] text-slate-400">{time}</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-sm sm:text-base ml-2">{amount}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Products Snapshot</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Your product performance</p>
                </div>
                <Package className="h-4 w-4 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              {products.map(({ name, status, sales }) => (
                <div key={name} className="p-2 sm:p-3 rounded-xl hover:bg-slate-50 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        status === 'Active' ? 'bg-emerald-500 shadow-emerald-500/50 shadow-lg' : 'bg-slate-300'
                      }`} />
                      <span className="font-medium text-slate-700 text-sm sm:text-base truncate">{name}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ml-2 ${
                      status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {status === 'Active' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((sales / 300) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-500 flex-shrink-0">{sales} sales</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}