import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, Trash2, ChevronRight, Calendar, Download, Package, Users, DollarSign } from 'lucide-react';
import MarketplaceLayout from '../MarketplaceLayout';

// Mock data
const creatorProducts = [
  { id: 1, name: "Instagram Reels Template Pack", type: "Digital", price: "₹499", inventory: "Unlimited", status: "Active", sales: 142, revenue: "₹70,858", category: "Templates" },
  { id: 2, name: "Premium Creator Hoodie", type: "Physical", price: "₹1,899", inventory: "45", status: "Active", sales: 89, revenue: "₹1,69,011", category: "Merchandise" },
  { id: 3, name: "YouTube Thumbnail Bundle", type: "Digital", price: "₹299", inventory: "Unlimited", status: "Active", sales: 256, revenue: "₹76,544", category: "Graphics" },
  { id: 4, name: "Podcast Intro Sound Pack", type: "Digital", price: "₹699", inventory: "Unlimited", status: "Draft", sales: 0, revenue: "₹0", category: "Audio" },
  { id: 5, name: "Limited Edition Stickers", type: "Physical", price: "₹249", inventory: "0", status: "Out", sales: 312, revenue: "₹77,688", category: "Merchandise" },
];

const creatorOrders = [
  { id: "#ORD-7841", customer: "Alex Johnson", product: "Creator Hoodie", date: "2024-03-15", amount: "₹1,899", status: "Delivered" },
  { id: "#ORD-7840", customer: "Sam Wilson", product: "Instagram Pack", date: "2024-03-14", amount: "₹499", status: "Processing" },
  { id: "#ORD-7839", customer: "Taylor Swift", product: "Thumbnail Bundle", date: "2024-03-14", amount: "₹299", status: "Shipped" },
];

const creatorStats = [
  { title: "Total Revenue", value: "₹3,94,101", change: "+12.5%", icon: <DollarSign className="h-4 w-4" />, color: "text-green-600" },
  { title: "Total Orders", value: "799", change: "+8.2%", icon: <Package className="h-4 w-4" />, color: "text-blue-600" },
  { title: "Products", value: "12", change: "+2", icon: <Package className="h-4 w-4" />, color: "text-purple-600" },
  { title: "Customers", value: "642", change: "+5.1%", icon: <Users className="h-4 w-4" />, color: "text-orange-600" },
];

export default function CreatorDashboard() {
  return (
    <MarketplaceLayout userType="creator">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {creatorStats.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-sm ${stat.color}`}>{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color.replace('text', 'bg')} bg-opacity-10`}>
                  {stat.icon}
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>Manage your digital and physical products</CardDescription>
              </div>
              <Button>Add New Product</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all">
                <div className="border-b px-6">
                  <TabsList className="flex space-x-2 flex-wrap justify-between h-auto gap-2">
                    <TabsTrigger value="all">All Products</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="out">Out of Stock</TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creatorProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-gradient-to-r from-purple-100 to-blue-100" />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.type}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="font-semibold">{product.price}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.sales}</p>
                              <Progress value={product.sales / 5} className="h-1 w-20" />
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">{product.revenue}</TableCell>
                          <TableCell>
                            <Badge variant={product.status === "Active" ? "default" : product.status === "Draft" ? "outline" : "secondary"}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
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
                  {creatorProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category} • {product.type}</p>
                        </div>
                        <Badge variant={product.status === "Active" ? "default" : "outline"}>
                          {product.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-semibold">{product.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Sales</p>
                          <p className="font-semibold">{product.sales}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Revenue</p>
                          <p className="font-semibold">{product.revenue}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
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
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creatorOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="font-semibold">{order.amount}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === "Delivered" ? "default" : 
                          order.status === "Processing" ? "secondary" : "outline"
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Quick Actions */}
        <div className="space-y-6">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Last 30 days revenue trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-sm">{month}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                          style={{ width: `${20 + i * 15}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">₹{((i + 1) * 45678).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Calendar className="h-4 w-4 mr-2" />
                View Detailed Report
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Products</span>
                <span className="font-semibold">8/12</span>
              </div>
              <Progress value={66} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Low Stock Items</span>
                <span className="font-semibold text-orange-600">2</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Out of Stock</span>
                <span className="font-semibold text-red-600">1</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Sales Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View Customers
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Payout Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketplaceLayout>
  );
}