"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  MoreVertical,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  PieChart,
} from "lucide-react";
import DashboardLayout from "@/components/direction-1-minimal/Dashboard/dashboard-layout.jsx";

export default function AdminDashboardMinimal() {
  const topCreators = [
    { name: "Alex Morgan", revenue: "₹82,000", products: 8, status: "active" },
    { name: "Riya Sharma", revenue: "₹65,400", products: 12, status: "active" },
    { name: "David Chen", revenue: "₹48,200", products: 5, status: "pending" },
    { name: "Maya Patel", revenue: "₹36,500", products: 7, status: "active" },
  ];

  const recentOrders = [
    { id: "#2031", creator: "Alex Morgan", amount: "₹1,299", status: "completed", date: "2 min ago" },
    { id: "#2030", creator: "Riya Sharma", amount: "₹799", status: "processing", date: "15 min ago" },
    { id: "#2029", creator: "Design Pro", amount: "₹2,499", status: "pending", date: "1 hour ago" },
    { id: "#2028", creator: "Code Master", amount: "₹599", status: "completed", date: "2 hours ago" },
  ];

  const platformStats = [
    { label: "Total Revenue", value: "₹4.8L", change: "+12.5%", trend: "up" },
    { label: "Total Orders", value: "1,248", change: "+8.3%", trend: "up" },
    { label: "Active Creators", value: "86", change: "+24.2%", trend: "up" },
    { label: "Conversion Rate", value: "3.8%", change: "-0.2%", trend: "down" },
  ];

  const headerButtons = (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="outline" size="sm" className="gap-2">
        <Calendar className="w-4 h-4" />
        Last 30 days
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <Filter className="w-4 h-4" />
        Filter
      </Button>
      <Button className="gap-2">
        <ChevronRight className="w-4 h-4" />
        Add Creator
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      type="admin"
      title="Platform Overview"
      subtitle="Monitor and manage all platform activities in real-time"
      headerButtons={headerButtons}
      userInitial="A"
      userName="Admin"
      showSearch={true}
      showNotifications={true}
      platformStatus={true}
    >
      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat) => (
          <Card key={stat.label} className="group hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  stat.trend === "up" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-1 mt-3 text-sm ${
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              }`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Creators */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Creators</CardTitle>
              <CardDescription>
                Highest earning creators this month
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCreators.map((creator) => (
                <div
                  key={creator.name}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {creator.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{creator.name}</p>
                        <Badge
                          variant={creator.status === "active" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {creator.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {creator.products} products
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{creator.revenue}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 gap-2">
              <ChevronRight className="w-4 h-4" />
              Manage All Creators
            </Button>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest transactions across platform
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      order.status === "completed" 
                        ? "bg-green-100" 
                        : order.status === "processing"
                        ? "bg-blue-100"
                        : "bg-amber-100"
                    }`}>
                      {order.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : order.status === "processing" ? (
                        <Clock className="w-5 h-5 text-blue-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{order.id}</p>
                        <Badge
                          variant={
                            order.status === "completed" ? "default" :
                            order.status === "processing" ? "secondary" : "outline"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.creator}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 gap-2">
              <PieChart className="w-4 h-4" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Platform Analytics */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>
                Key metrics and growth trends
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Daily</Button>
              <Button variant="default" size="sm">Monthly</Button>
              <Button variant="outline" size="sm">Yearly</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {[
              {
                title: "Revenue Distribution",
                data: [
                  { label: "Digital Products", value: "68%", color: "bg-blue-500" },
                  { label: "Subscriptions", value: "22%", color: "bg-purple-500" },
                  { label: "Services", value: "10%", color: "bg-green-500" },
                ],
              },
              {
                title: "Platform Growth",
                data: [
                  { label: "New Creators", value: "+24", change: "+12%" },
                  { label: "New Products", value: "+86", change: "+18%" },
                  { label: "New Orders", value: "+312", change: "+8%" },
                ],
              },
              {
                title: "Geographic Distribution",
                data: [
                  { label: "India", value: "42%", flag: "🇮🇳" },
                  { label: "USA", value: "28%", flag: "🇺🇸" },
                  { label: "Europe", value: "18%", flag: "🇪🇺" },
                  { label: "Others", value: "12%", flag: "🌍" },
                ],
              },
            ].map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-medium">{section.title}</h3>
                <div className="space-y-3">
                  {section.data.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.color && (
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        )}
                        {item.flag && <span className="text-lg">{item.flag}</span>}
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.value}</span>
                        {item.change && (
                          <span className="text-xs text-green-600">{item.change}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}