"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingBag,
  Store,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import MarketplaceLayout from "../../MarketplaceLayout";
import { platformAnalytics, adminCreators } from "@/app/data/MarketplaceAdmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminAnalyticsPage() {
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const stats = [
    {
      title: "Platform Revenue",
      value: platformAnalytics.overview.totalRevenue,
      change: `+${platformAnalytics.growth.revenueGrowth}%`,
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Total Transactions",
      value: platformAnalytics.overview.totalTransactions,
      change: `+${platformAnalytics.growth.transactionGrowth}%`,
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Active Users",
      value: platformAnalytics.overview.totalUsers,
      change: `+${platformAnalytics.growth.userGrowth}%`,
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Platform Fees",
      value: platformAnalytics.overview.platformFees,
      change: "+16.2%",
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  return (
    <MarketplaceLayout userType="admin" showFilters={false}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Platform Analytics
            </h1>
            <p className="text-gray-500 mt-1">
              Comprehensive insights and performance metrics
            </p>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
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
                    {stat.title.includes("Revenue") ||
                    stat.title.includes("Fees")
                      ? formatCurrency(stat.value)
                      : formatNumber(stat.value)}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className={`h-4 w-4 ${stat.color}`} />
                    ) : (
                      <TrendingDown className={`h-4 w-4 ${stat.color}`} />
                    )}
                    <span className={`text-sm font-semibold ${stat.color}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last period
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Revenue Growth
                </CardTitle>
                <CardDescription className="mt-1">
                  Monthly revenue performance
                </CardDescription>
              </div>
              <Select defaultValue="revenue">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {platformAnalytics.revenueByMonth.map((data, index) => (
                <div key={data.month} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {data.month}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(data.revenue)}
                    </span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all group-hover:from-purple-700 group-hover:to-blue-700"
                      style={{ width: `${(data.revenue / 450000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Creators */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-orange-50/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Top Performers
            </CardTitle>
            <CardDescription className="mt-1">
              Highest revenue creators
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="space-y-4">
              {platformAnalytics.topCreators
                .slice(0, 5)
                .map((creator, index) => (
                  <div key={creator.name} className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                            ? "bg-gray-200 text-gray-700"
                            : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {creator.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {creator.sales} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-green-600">
                        {formatCurrency(creator.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Performance */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Category Performance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
              Revenue by product category
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-4">
              {platformAnalytics.categoryBreakdown.map((category, index) => {
                const colors = [
                  {
                    bg: "bg-purple-500",
                    light: "bg-purple-100",
                    text: "text-purple-700",
                  },
                  {
                    bg: "bg-blue-500",
                    light: "bg-blue-100",
                    text: "text-blue-700",
                  },
                  {
                    bg: "bg-green-500",
                    light: "bg-green-100",
                    text: "text-green-700",
                  },
                  {
                    bg: "bg-orange-500",
                    light: "bg-orange-100",
                    text: "text-orange-700",
                  },
                  {
                    bg: "bg-red-500",
                    light: "bg-red-100",
                    text: "text-red-700",
                  },
                ];
                const color = colors[index % colors.length];

                return (
                  <div key={category.category} className="space-y-2">
                    {/* Header row - stacked on mobile, side by side on larger screens */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <div
                          className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full ${color.bg} flex-shrink-0`}
                        />
                        <span className="font-medium text-sm sm:text-base text-gray-900 truncate max-w-[120px] sm:max-w-none">
                          {category.category}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] sm:text-xs whitespace-nowrap"
                        >
                          {category.count} products
                        </Badge>
                      </div>
                      <span className="font-bold text-sm sm:text-base text-gray-900 ml-auto sm:ml-0">
                        {formatCurrency(category.revenue)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full">
                      <Progress
                        value={category.percentage}
                        className="h-2 sm:h-2.5"
                      />

                      {/* Percentage indicator - visible on mobile for better context */}
                      <div className="flex justify-end mt-1 sm:hidden">
                        <span className="text-xs text-gray-500">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        {/* User Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              User Activity
            </CardTitle>
            <CardDescription className="mt-1">
              Daily signups and purchases
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {platformAnalytics.userActivity.map((day) => {
                const date = new Date(day.date);
                const dateStr = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={day.date}
                    className="p-4 rounded-xl border hover:bg-green-50/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {dateStr}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {formatCurrency(day.revenue)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Signups</p>
                        <p className="text-lg font-bold text-green-600">
                          {day.signups}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Purchases</p>
                        <p className="text-lg font-bold text-blue-600">
                          {day.purchases}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
          <CardTitle className="text-xl">Platform Overview</CardTitle>
          <CardDescription>
            Key metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <p className="text-sm text-purple-700 mb-1">Creator Earnings</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(platformAnalytics.overview.creatorEarnings)}
              </p>
              <p className="text-xs text-purple-600 mt-2">
                Total paid to creators
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Total Creators</p>
              <p className="text-2xl font-bold text-blue-900">
                {platformAnalytics.overview.totalCreators}
              </p>
              <p className="text-xs text-blue-600 mt-2">Active on platform</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <p className="text-sm text-green-700 mb-1">Total Buyers</p>
              <p className="text-2xl font-bold text-green-900">
                {platformAnalytics.overview.totalBuyers}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Registered customers
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <p className="text-sm text-orange-700 mb-1">Active Stores</p>
              <p className="text-2xl font-bold text-orange-900">
                {platformAnalytics.overview.activeStores}
              </p>
              <p className="text-xs text-orange-600 mt-2">
                Currently operating
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MarketplaceLayout>
  );
}
