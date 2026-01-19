import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Eye, Edit, Users, Package, DollarSign, Bell, TrendingUp } from 'lucide-react';
import MarketplaceLayout from '../MarketplaceLayout';

// Mock data
const adminUsers = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Creator", products: 8, sales: "₹2,41,500", status: "Active", joinDate: "2023-11-15" },
  { id: 2, name: "Sam Wilson", email: "sam@example.com", role: "Creator", products: 12, sales: "₹3,94,101", status: "Active", joinDate: "2023-09-22" },
  { id: 3, name: "Jordan Lee", email: "jordan@example.com", role: "Buyer", purchases: 6, spend: "₹8,994", status: "Active", joinDate: "2024-01-10" },
  { id: 4, name: "Taylor Swift", email: "taylor@example.com", role: "Creator", products: 5, sales: "₹1,56,789", status: "Suspended", joinDate: "2024-02-28" },
];

const adminStats = [
  { title: "Platform Revenue", value: "₹82,14,567", change: "+18.3%", icon: <DollarSign className="h-4 w-4" />, color: "text-green-600" },
  { title: "Total Transactions", value: "12,456", change: "+14.7%", icon: <TrendingUp className="h-4 w-4" />, color: "text-blue-600" },
  { title: "Active Creators", value: "1,248", change: "+42", icon: <Users className="h-4 w-4" />, color: "text-purple-600" },
  { title: "New Signups", value: "342", change: "+23.1%", icon: <Users className="h-4 w-4" />, color: "text-orange-600" },
];

const platformProducts = [
  { id: 1, name: "Premium Photography Presets", creator: "Alex Johnson", category: "Templates", price: "₹899", sales: 421, revenue: "₹3,78,279", status: "Active" },
  { id: 2, name: "Fitness Training Program", creator: "Sam Wilson", category: "Courses", price: "₹2,499", sales: 156, revenue: "₹3,89,844", status: "Active" },
  { id: 3, name: "UI/UX Design Kit", creator: "Jordan Lee", category: "Graphics", price: "₹1,299", sales: 89, revenue: "₹1,15,611", status: "Review" },
];

export default function AdminDashboard() {
  return (
    <MarketplaceLayout userType="admin">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {adminStats.map((stat, index) => (
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
        {/* Left Column - Users & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Users Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage creators and buyers on the platform</CardDescription>
              </div>
              <Button>Add New User</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all">
                <div className="border-b px-6">
                  <TabsList className="flex space-x-2 flex-wrap justify-between h-auto gap-2">
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="creators">Creators</TabsTrigger>
                    <TabsTrigger value="buyers">Buyers</TabsTrigger>
                    <TabsTrigger value="pending">Pending Review</TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Products/Purchases</TableHead>
                        <TableHead>Total Sales/Spend</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === "Creator" ? "default" : "outline"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.role === "Creator" ? user.products : user.purchases}
                          </TableCell>
                          <TableCell className="font-bold">
                            {user.role === "Creator" ? user.sales : user.spend}
                          </TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                                {user.status}
                              </Badge>
                              <Switch checked={user.status === "Active"} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile User List */}
                <div className="md:hidden space-y-4 p-6">
                  {adminUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p className="font-semibold">{user.role}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {user.role === "Creator" ? "Products" : "Purchases"}
                          </p>
                          <p className="font-semibold">
                            {user.role === "Creator" ? user.products : user.purchases}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Platform Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Platform Products</CardTitle>
              <CardDescription>Best selling products across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platformProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-gradient-to-r from-green-100 to-blue-100" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.creator}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="font-semibold">{product.price}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell className="font-bold">{product.revenue}</TableCell>
                      <TableCell>
                        <Badge variant={product.status === "Active" ? "default" : "outline"}>
                          {product.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Admin Controls */}
        <div className="space-y-6">
          {/* Platform Health */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>System status and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Server Uptime</span>
                <span className="font-semibold text-green-600">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Sessions</span>
                <span className="font-semibold">1,248</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Reviews</span>
                <span className="font-semibold text-orange-600">42</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Support Tickets</span>
                <span className="font-semibold text-blue-600">18</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage User Permissions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Review Pending Products
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                View Platform Revenue
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Send Platform Announcement
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "New creator 'Alex Johnson' joined",
                "Product 'UI Kit' approved",
                "User 'Taylor Swift' suspended",
                "Platform update v2.1 deployed",
                "New support ticket #7841 received"
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm">{activity}</span>
                  <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketplaceLayout>
  );
}