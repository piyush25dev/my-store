"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, Edit, Trash2, ChevronRight, Calendar, Download, Package, 
  Users, DollarSign, TrendingUp, ShoppingBag, Star, ArrowUpRight 
} from 'lucide-react';
import MarketplaceLayout from '../MarketplaceLayout';
import { creatorProducts, creatorOrders, creatorStats, salesData } from '@/app/data/Marketplacedata';
import Link from 'next/link';

export default function CreatorDashboard() {
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <MarketplaceLayout pageTitle="Dashboard" userType="creator">
      {/* Welcome Banner */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white shadow-xl shadow-purple-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Creator! 👋</h1>
            <p className="text-purple-100">Here&apos;s what&apos;s happening with your store today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {creatorStats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">
                    {stat.title.includes('Revenue') ? formatCurrency(stat.value) : stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className={`h-4 w-4 ${stat.color}`} />
                    <span className={`text-sm font-semibold ${stat.color}`}>{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgColor} bg-opacity-10`}>
                  {stat.title.includes('Revenue') && <DollarSign className={`h-6 w-6 ${stat.color}`} />}
                  {stat.title.includes('Orders') && <ShoppingBag className={`h-6 w-6 ${stat.color}`} />}
                  {stat.title.includes('Products') && <Package className={`h-6 w-6 ${stat.color}`} />}
                  {stat.title.includes('Customers') && <Users className={`h-6 w-6 ${stat.color}`} />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products & Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
              <div>
                <CardTitle className="text-xl">Your Products</CardTitle>
                <CardDescription className="mt-1">Manage your digital and physical products</CardDescription>
              </div>
              <Link href="/mockups/direction-2-marketplace/dashboard/creator/products">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Add New Product
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="!p-0 md:!p-4">
              <Tabs defaultValue="all" className="">
                <div className="border-b bg-gray-50/50">
                  <TabsList  className="
      w-full
      flex
      flex-wrap
      md:grid
      md:grid-cols-5
      h-auto
      gap-2
      p-4
      md:px-0
    "
    style={{
      scrollPaddingLeft: "1rem",
      scrollPaddingRight: "1rem",
    }}>
                    <TabsTrigger value="all" className="flex-shrink-0 md:w-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      All Products
                    </TabsTrigger>
                    <TabsTrigger value="active" className="flex-shrink-0 md:w-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="flex-shrink-0 md:w-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Draft
                    </TabsTrigger>
                    <TabsTrigger value="out" className="flex-shrink-0 md:w-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Out of Stock
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Sales</TableHead>
                        <TableHead className="font-semibold">Revenue</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creatorProducts.slice(0, 5).map((product) => (
                        <TableRow key={product.id} className="hover:bg-purple-50/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center shadow-sm">
                                <Package className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.type}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900">{formatCurrency(product.price)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-gray-900">{product.sales}</p>
                              <Progress value={product.sales / 5} className="h-1.5 w-20 mt-1" />
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">{formatCurrency(product.revenue)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={product.status === "Active" ? "default" : product.status === "Draft" ? "outline" : "secondary"}
                              className={
                                product.status === "Active" 
                                  ? "bg-green-500 hover:bg-green-600" 
                                  : product.status === "Draft" 
                                  ? "border-orange-300 text-orange-700 bg-orange-50" 
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="hover:bg-purple-100 hover:text-purple-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="hover:bg-blue-100 hover:text-blue-600">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="hover:bg-red-100 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile Product List */}
                <div className="md:hidden space-y-4 p-6">
                  {creatorProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                            <Package className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category} • {product.type}</p>
                          </div>
                        </div>
                        <Badge variant={product.status === "Active" ? "default" : "outline"}>
                          {product.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-semibold">{formatCurrency(product.price)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Sales</p>
                          <p className="font-semibold">{product.sales}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Revenue</p>
                          <p className="font-semibold text-green-600">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t bg-gray-50/50">
                  <Link href="/creator/products">
                    <Button variant="outline" className="w-full">
                      View All Products ({creatorProducts.length})
                    </Button>
                  </Link>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Recent Orders</CardTitle>
                  <CardDescription className="mt-1">Latest customer orders and transactions</CardDescription>
                </div>
                <Link href="/creator/orders">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="!p-0 md:!p-4">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creatorOrders.slice(0, 5).map((order) => (
                      <TableRow key={order.id} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="font-semibold text-purple-600">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{order.customer}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.product}</TableCell>
                        <TableCell className="text-gray-600">{order.date}</TableCell>
                        <TableCell className="font-bold text-green-600">{formatCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              order.status === "Delivered" ? "default" : 
                              order.status === "Processing" ? "secondary" : "outline"
                            }
                            className={
                              order.status === "Delivered" 
                                ? "bg-green-500 hover:bg-green-600" 
                                : order.status === "Processing" 
                                ? "bg-blue-500 hover:bg-blue-600" 
                                : "bg-orange-500 text-white hover:bg-orange-600"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Orders */}
              <div className="md:hidden space-y-4 p-6">
                {creatorOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="border rounded-xl p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-purple-600">{order.id}</p>
                        <p className="text-sm text-gray-900 font-medium mt-1">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.product}</p>
                      </div>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{order.date}</span>
                      <span className="font-bold text-green-600">{formatCurrency(order.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Quick Actions */}
        <div className="space-y-6">
          {/* Performance Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Sales Performance
              </CardTitle>
              <CardDescription className="mt-1">Last 6 months revenue trend</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {salesData.map((month, i) => (
                  <div key={month.month} className="flex items-center justify-between group">
                    <span className="text-sm font-medium text-gray-600 w-12">{month.month}</span>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-3 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all group-hover:from-purple-700 group-hover:to-blue-700"
                          style={{ width: `${20 + i * 15}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-24 text-right">
                        {formatCurrency(month.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/creator/analytics">
                <Button variant="outline" className="w-full mt-6 border-purple-200 hover:bg-purple-50">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Detailed Report
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Inventory Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-orange-50/30">
              <CardTitle className="text-xl">Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Active Products</span>
                  <span className="font-bold text-gray-900">8/12</span>
                </div>
                <Progress value={66} className="h-2.5" />
              </div>
              
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-orange-700">Low Stock Items</span>
                  <span className="font-bold text-orange-600 text-lg">2</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-red-700">Out of Stock</span>
                  <span className="font-bold text-red-600 text-lg">1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-200">
                <Download className="h-4 w-4 mr-3" />
                Export Sales Report
              </Button>
              <Link href="/creator/products" className="block">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-200">
                  <Package className="h-4 w-4 mr-3" />
                  Manage Inventory
                </Button>
              </Link>
              <Link href="/creator/customers" className="block">
                <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200">
                  <Users className="h-4 w-4 mr-3" />
                  View Customers
                </Button>
              </Link>
              <Link href="/creator/settings" className="block">
                <Button variant="outline" className="w-full justify-start hover:bg-orange-50 hover:border-orange-200">
                  <DollarSign className="h-4 w-4 mr-3" />
                  Payout Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketplaceLayout>
  );
}