import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingBag, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹82,40,000", icon: TrendingUp, trend: "+12.5%", color: "text-emerald-600" },
    { label: "Active Creators", value: "124", icon: Users, trend: "+8", color: "text-blue-600" },
    { label: "Orders Today", value: "1,284", icon: ShoppingBag, trend: "+23%", color: "text-purple-600" },
    { label: "Disputes", value: "6", icon: AlertCircle, trend: "-2", color: "text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-0 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Platform Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Monitor your platform&apos;s performance in real-time</p>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(({ label, value, icon: Icon, trend, color }) => (
            <Card key={label} className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                  <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${color.replace('text-', 'from-')}/10 ${color.replace('text-', 'to-')}/5`}>
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                <p className={`text-[10px] sm:text-xs font-medium ${trend.startsWith('+') ? 'text-emerald-600' : trend.startsWith('-') && label !== 'Disputes' ? 'text-rose-600' : 'text-slate-500'}`}>
                  {trend} from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-3 sm:pb-4">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Top Creators</h3>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Highest earning creators this month</p>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              {[
                { name: "Alex Morgan", amount: "₹9.2L", rank: 1 },
                { name: "Studio Labs", amount: "₹7.4L", rank: 2 },
                { name: "Sarah Chen", amount: "₹6.8L", rank: 3 },
              ].map(({ name, amount, rank }) => (
                <div key={name} className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {rank}
                    </div>
                    <span className="font-medium text-slate-700 text-sm sm:text-base">{name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 text-sm sm:text-base">{amount}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-3 sm:pb-4">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">System Alerts</h3>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Items requiring your attention</p>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              {[
                { text: "2 payouts pending approval", priority: "medium" },
                { text: "1 flagged product review", priority: "high" },
                { text: "System maintenance scheduled", priority: "low" },
              ].map(({ text, priority }) => (
                <div key={text} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    priority === 'high' ? 'bg-rose-500' : 
                    priority === 'medium' ? 'bg-amber-500' : 
                    'bg-slate-300'
                  }`} />
                  <span className="text-xs sm:text-sm text-slate-600">{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}