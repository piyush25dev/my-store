"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Plus,
  ChevronRight,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  MoreVertical,
  Calendar,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/direction-1-minimal/Dashboard/dashboard-layout.jsx";

const iconMap = {
  DollarSign: DollarSign,
  ShoppingCart: ShoppingCart,
  Package: Package,
  Users: Users,
};

const statsData = [
  {
    id: 1,
    title: "Total Revenue",
    value: "₹42,300",
    change: "+12.5% from last month",
    icon: "DollarSign",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-l-blue-500",
    trend: "up",
    subText: null,
  },
  {
    id: 2,
    title: "Total Orders",
    value: "128",
    change: "+8.3% from last month",
    icon: "ShoppingCart",
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-l-green-500",
    trend: "up",
    subText: null,
  },
  {
    id: 3,
    title: "Active Products",
    value: "6",
    change: null,
    icon: "Package",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-l-purple-500",
    trend: null,
    subText: "2 in draft",
  },
  {
    id: 4,
    title: "Customers",
    value: "94",
    change: "+24 new this month",
    icon: "Users",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-l-amber-500",
    trend: "up",
    subText: null,
  },
];

export default function CreatorDashboardMinimal() {
  const products = [
    {
      name: "Notion Creator Kit",
      price: "₹1,299",
      status: "Active",
      sales: 42,
    },
    {
      name: "Instagram Hooks Pack",
      price: "₹599",
      status: "Active",
      sales: 28,
    },
    {
      name: "Product Launch Template",
      price: "₹2,499",
      status: "Draft",
      sales: 0,
    },
  ];

  const recentOrders = [
    {
      id: "#1023",
      customer: "Rahul Sharma",
      amount: "₹799",
      status: "Completed",
      time: "2 hours ago",
    },
    {
      id: "#1022",
      customer: "Priya Patel",
      amount: "₹1,299",
      status: "Processing",
      time: "5 hours ago",
    },
    {
      id: "#1021",
      customer: "Amit Verma",
      amount: "₹599",
      status: "Completed",
      time: "1 day ago",
    },
  ];

  const headerButtons = (
    <>
      <Button variant="outline" size="sm" className="gap-2">
        <TrendingUp className="w-4 h-4" />
        Analytics
      </Button>
      <Button className="gap-2">
        <Plus className="w-4 h-4" />
        Add Product
      </Button>
    </>
  );

  return (
    <DashboardLayout
      type="creator"
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening with your store."
      headerButtons={headerButtons}
      userInitial="C"
      userName="Creator"
      platformStatus={false}
    >
      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const IconComponent = iconMap[stat.icon];

          return (
            <Card key={stat.id} className={`border-l-4 ${stat.borderColor}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                {stat.change && (
                  <p
                    className={`text-xs ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    } mt-3 flex items-center gap-1`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                )}
                {stat.subText && (
                  <p className="text-xs text-muted-foreground mt-3">
                    {stat.subText}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Products Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your digital products
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span>{product.price}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {product.status === "Active" ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-500" />
                          )}
                          {product.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">{product.sales}</p>
                      <p className="text-xs text-muted-foreground">sales</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Latest customer purchases
              </p>
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
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="items-center gap-2 flex-row sm:flex ">
                        <p className="font-medium">{order.id}</p>
                        <Badge className="text-xs bg-green-100 text-green-700">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 gap-2">
              <BarChart3 className="w-4 h-4" />
              View Order Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Key metrics for the last 30 days
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {[
              { label: "Conversion Rate", value: "3.2%", change: "+0.4%" },
              { label: "Avg. Order Value", value: "₹854", change: "+₹112" },
              { label: "Returning Customers", value: "42%", change: "+8%" },
              { label: "Page Views", value: "4.2K", change: "+12.5%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-green-600 mt-2">{stat.change}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}