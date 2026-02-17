"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Edit,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  Store,
  CheckCircle,
  Clock,
  Shield,
  Activity,
  Bell,
} from "lucide-react";
import MarketplaceLayout from "../MarketplaceLayout";
import {
  platformAnalytics,
  adminCreators,
  recentActivity,
  pendingApprovals,
  systemHealth,
  storeAnalytics,
} from "@/app/data/MarketplaceAdmin";
import Link from "next/link";

export default function AdminDashboard() {
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const platformStats = [
    {
      title: "Platform Revenue",
      value: platformAnalytics.overview.totalRevenue,
      change: `+${platformAnalytics.growth.revenueGrowth}%`,
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Transactions",
      value: platformAnalytics.overview.totalTransactions,
      change: `+${platformAnalytics.growth.transactionGrowth}%`,
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Creators",
      value: platformAnalytics.overview.totalCreators,
      change: `+${platformAnalytics.growth.creatorGrowth}%`,
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Stores",
      value: platformAnalytics.overview.activeStores,
      change: "+12",
      icon: <Store className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const alertStats = [
    {
      title: "Pending Approvals",
      value: platformAnalytics.overview.pendingApprovals,
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      urgent: true,
    },
    {
      title: "Flagged Content",
      value: platformAnalytics.overview.flaggedContent,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      urgent: true,
    },
    {
      title: "Support Tickets",
      value: platformAnalytics.overview.supportTickets,
      icon: <Bell className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      urgent: false,
    },
  ];

  return (
    <MarketplaceLayout userType="admin">
      {/* Admin Header */}
      <div className="mb-4 sm:mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl overflow-hidden">
        <div className="flex flex-col items-start justify-between gap-4">
          {/* Title Section */}
          <div className="w-full">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-purple-200 text-xs sm:text-sm md:text-base">
              Platform Management & Oversight
            </p>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Link href="mockups/direction-2-marketplace/dashboard/admin/approvals" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="bg-orange-500 hover:bg-orange-300 text-black w-full sm:w-auto justify-center text-sm sm:text-base py-2 sm:py-2.5"
              >
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="truncate">
                  {platformAnalytics.overview.pendingApprovals} Pending
                </span>
              </Button>
            </Link>

            <Link href="/mockups/direction-2-marketplace/dashboard/admin/settings" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="bg-white text-slate-900 hover:bg-gray-100 w-full sm:w-auto justify-center text-sm sm:text-base py-2 sm:py-2.5"
              >
                Platform Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {platformStats.map((stat, index) => (
          <Card
            key={index}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow pt-4"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {stat.title.includes("Revenue")
                      ? formatCurrency(stat.value)
                      : formatNumber(stat.value)}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className={`h-4 w-4 ${stat.color}`} />
                    <span className={`text-sm font-semibold ${stat.color}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      this month
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {alertStats.map((alert, index) => (
          <Card
            key={index}
            className={`border-2 ${alert.urgent ? "border-orange-200" : "border-blue-200"} shadow-lg pt-4`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${alert.bgColor}`}>
                    <div className={alert.color}>{alert.icon}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {alert.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{alert.value}</p>
                  </div>
                </div>
                {alert.urgent && (
                  <Badge className="bg-orange-500">Action Required</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Creators */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Top Performing Creators
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Highest revenue generators this month
                  </CardDescription>
                </div>
                <Link href="/admin/creators">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Rank</TableHead>
                    <TableHead className="font-semibold">Creator</TableHead>
                    <TableHead className="font-semibold">Store</TableHead>
                    <TableHead className="font-semibold">Sales</TableHead>
                    <TableHead className="font-semibold">Revenue</TableHead>
                    <TableHead className="font-semibold">Commission</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platformAnalytics.topCreators.map((creator, index) => {
                    const creatorData = adminCreators.find(
                      (c) => c.name === creator.name,
                    );
                    return (
                      <TableRow key={index} className="hover:bg-purple-50/30">
                        <TableCell>
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-700"
                                : index === 1
                                  ? "bg-gray-100 text-gray-700"
                                  : index === 2
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-purple-100">
                              <AvatarImage src={creatorData?.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                                {creator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {creator.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {creatorData?.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {creatorData?.storeName}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold">{creator.sales}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-green-600">
                            {formatCurrency(creator.revenue)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-purple-600">
                            {formatCurrency(creator.commission)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-orange-50/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Items requiring review
                  </CardDescription>
                </div>
                <Link href="/admin/approvals" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Review All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-xl hover:bg-orange-50/30 transition-colors gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                        {item.type === "Product" && (
                          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                        )}
                        {item.type === "Creator" && (
                          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                        )}
                        {item.type === "Payout" && (
                          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                            {item.itemName}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] sm:text-xs whitespace-nowrap"
                          >
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          By {item.creator}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                          Submitted {item.submittedDate}
                        </p>
                      </div>
                      {item.price && (
                        <div className="text-right ml-auto sm:ml-0 sm:mr-4 flex-shrink-0">
                          <p className="font-bold text-green-600 text-sm sm:text-base">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                        <span className="sm:inline">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                        <span className="sm:inline">Review</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* System Health */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Server Uptime
                  </span>
                  <span className="font-bold text-green-600">
                    {systemHealth.serverUptime}%
                  </span>
                </div>
                <Progress
                  value={systemHealth.serverUptime}
                  className="h-2.5 bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-xs text-gray-600 mb-1">Active Sessions</p>
                  <p className="text-lg font-bold text-blue-600">
                    {systemHealth.activeSessions.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-xs text-gray-600 mb-1">API Response</p>
                  <p className="text-lg font-bold text-purple-600">
                    {systemHealth.apiResponseTime}ms
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Storage Used
                  </span>
                  <span className="font-bold text-gray-900">
                    {systemHealth.storageUsed}%
                  </span>
                </div>
                <Progress
                  value={systemHealth.storageUsed}
                  className="h-2.5 bg-gray-100"
                />
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Errors (24h)</span>
                  <Badge
                    variant="outline"
                    className="text-red-600 border-red-200"
                  >
                    {systemHealth.errors24h}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Warnings (24h)</span>
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200"
                  >
                    {systemHealth.warnings24h}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-600" />
                Store Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {storeAnalytics.slice(0, 3).map((store, index) => (
                  <div
                    key={store.storeId}
                    className="p-4 rounded-xl border hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          store.status === "Active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <p className="font-semibold text-sm text-gray-900">
                        {store.storeName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      {store.creator}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Products</p>
                        <p className="font-semibold">
                          {store.activeProducts}/{store.totalProducts}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Orders</p>
                        <p className="font-semibold">{store.orderCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(store.monthlyRevenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rating</p>
                        <p className="font-semibold text-orange-600">
                          ⭐ {store.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-slate-50">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`h-2 w-2 rounded-full mt-2 ${
                        activity.type.includes("approved") ||
                        activity.type.includes("joined")
                          ? "bg-green-500"
                          : activity.type.includes("suspended") ||
                              activity.type.includes("flagged")
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
