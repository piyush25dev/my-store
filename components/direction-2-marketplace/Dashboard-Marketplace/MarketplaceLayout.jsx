import { Search, Bell, Download, Filter, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MarketplaceLayout({ 
  children, 
  userType = "creator" 
}) {
  const isAdmin = userType === "admin";
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600" />
                <span className="text-xl font-bold">CreatorMarket</span>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                <a href="#" className="font-medium text-gray-900 hover:text-purple-600">
                  Dashboard
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  {isAdmin ? "Users" : "Products"}
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  {isAdmin ? "Transactions" : "Orders"}
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  Analytics
                </a>
                <a href="#" className="text-gray-600 hover:text-purple-600">
                  Settings
                </a>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{isAdmin ? "AD" : "CR"}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{isAdmin ? "Admin User" : "Creator Name"}</p>
                  <p className="text-xs text-gray-500">{isAdmin ? "Platform Admin" : "Verified Creator"}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters Bar */}
      <div className="border-b bg-white">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={`Search ${isAdmin ? 'users, products, transactions...' : 'products, orders, customers...'}`}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="30days">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                {isAdmin ? "Add User" : "Add Product"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 lg:px-6 py-6">
        {children}
      </main>
    </div>
  );
}