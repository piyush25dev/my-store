"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, 
  Package, BarChart3, PieChart, Calendar, Download, ArrowUpRight,
  ArrowDownRight, Target, Award
} from 'lucide-react';
import MarketplaceLayout from '../../MarketplaceLayout';
import { analyticsData, salesData, creatorProducts } from '@/app/data/Marketplacedata';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsPage() {
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <MarketplaceLayout pageTitle="Analytics" showFilters={false} userType="creator">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">Track your performance and growth metrics</p>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Time period" />
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
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">
                    {formatPercentage(analyticsData.overview.revenueGrowth)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold mt-2">{analyticsData.overview.totalOrders.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">
                    {formatPercentage(analyticsData.overview.orderGrowth)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-100">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(analyticsData.overview.avgOrderValue)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600">+5.2%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-purple-100">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold mt-2">{formatPercentage(analyticsData.overview.conversionRate)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-600">+0.5%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-orange-100">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Revenue Over Time
                </CardTitle>
                <CardDescription className="mt-1">Monthly revenue performance</CardDescription>
              </div>
              <Select defaultValue="revenue">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {analyticsData.revenueByMonth.map((data, index) => (
                <div key={data.month} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{data.month}</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(data.revenue)}</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all group-hover:from-purple-700 group-hover:to-blue-700"
                      style={{ width: `${(data.revenue / 400000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-orange-50/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Top Products
            </CardTitle>
            <CardDescription className="mt-1">Best performing products</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className={`
                    h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      index === 1 ? 'bg-gray-100 text-gray-700' : 
                      index === 2 ? 'bg-orange-100 text-orange-700' : 
                      'bg-purple-100 text-purple-700'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-600">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Category Performance
            </CardTitle>
            <CardDescription className="mt-1">Revenue by product category</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analyticsData.categoryPerformance.map((category, index) => {
                const colors = [
                  { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' },
                  { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
                  { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' },
                  { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700' },
                  { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-700' },
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={category.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${color.bg}`} />
                        <span className="font-medium text-gray-900">{category.category}</span>
                      </div>
                      <span className="font-bold text-gray-900">{formatCurrency(category.revenue)}</span>
                    </div>
                    <Progress value={category.percentage} className="h-2.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Traffic Sources
            </CardTitle>
            <CardDescription className="mt-1">Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <span className="font-bold text-purple-600">{source.source[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{source.source}</p>
                      <p className="text-sm text-gray-500">{source.visits.toLocaleString()} visits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                      {formatPercentage(source.conversion)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Performance by Month */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Monthly Performance Breakdown
              </CardTitle>
              <CardDescription className="mt-1">Detailed monthly metrics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salesData.map((month) => (
              <div key={month.month} className="p-5 rounded-xl border bg-gradient-to-br from-white to-purple-50/30 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-4">{month.month}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-bold text-green-600">{formatCurrency(month.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Orders</span>
                    <span className="font-semibold text-blue-600">{month.orders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customers</span>
                    <span className="font-semibold text-purple-600">{month.customers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MarketplaceLayout>
  );
}