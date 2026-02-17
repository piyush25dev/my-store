"use client";

import {
  Search,
  Bell,
  Download,
  Filter,
  MoreVertical,
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  HelpCircle,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Creator navigation items
const creatorNavigationItems = [
  {
    name: "Dashboard",
    href: "/mockups/direction-2-marketplace/dashboard/creator",
    icon: Home,
  },
  {
    name: "Products",
    href: "/mockups/direction-2-marketplace/dashboard/creator/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/mockups/direction-2-marketplace/dashboard/creator/orders",
    icon: ShoppingCart,
  },
  {
    name: "Analytics",
    href: "/mockups/direction-2-marketplace/dashboard/creator/analytics",
    icon: BarChart3,
  },
  {
    name: "Customers",
    href: "/mockups/direction-2-marketplace/dashboard/creator/customers",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/mockups/direction-2-marketplace/dashboard/creator/settings",
    icon: Settings,
  },
];

// Admin navigation items
const adminNavigationItems = [
  {
    name: "Dashboard",
    href: "/mockups/direction-2-marketplace/dashboard/admin",
    icon: Home,
  },
  {
    name: "Creators",
    href: "/mockups/direction-2-marketplace/dashboard/admin/creators",
    icon: Users,
  },
  {
    name: "Products",
    href: "/mockups/direction-2-marketplace/dashboard/admin/products",
    icon: Package,
  },
  {
    name: "Transactions",
    href: "/mockups/direction-2-marketplace/dashboard/admin/transactions",
    icon: ShoppingCart,
  },
  {
    name: "Approvals",
    href: "/mockups/direction-2-marketplace/dashboard/admin/approvals",
    icon: Shield,
  },
  {
    name: "Analytics",
    href: "/mockups/direction-2-marketplace/dashboard/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/mockups/direction-2-marketplace/dashboard/admin/settings",
    icon: Settings,
  },
];

export default function MarketplaceLayout({
  children,
  userType = "creator",
  pageTitle = "Dashboard",
  showSearch = true,
  showFilters = true,
}) {
  const pathname = usePathname();
  const isAdmin = userType === "admin";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);

  // Select navigation items based on user type
  const navigationItems = isAdmin
    ? adminNavigationItems
    : creatorNavigationItems;

  // Dynamic colors based on user type
  const brandColors = isAdmin
    ? {
        gradient: "from-slate-900 via-purple-900 to-slate-900",
        primary: "from-slate-700 to-purple-700",
        accent: "slate-600",
        light: "slate-50",
      }
    : {
        gradient: "from-purple-600 via-purple-500 to-blue-600",
        primary: "from-purple-600 to-blue-600",
        accent: "purple-600",
        light: "purple-50",
      };

  return (
    <div
      className={`min-h-screen ${isAdmin ? "bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100" : "bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30"}`}
    >
      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-50 ${isAdmin ? "bg-slate-900/95" : "bg-white/80"} backdrop-blur-xl border-b ${isAdmin ? "border-slate-700/50" : "border-gray-200/50"} shadow-sm`}
      >
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Navigation - Left side */}
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6 min-w-0 flex-1">
              {/* Logo */}
              <Link
                href={isAdmin ? "/admin" : "/creator"}
                className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0"
              >
                <div
                  className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br ${brandColors.gradient} shadow-lg ${isAdmin ? "shadow-slate-500/30" : "shadow-purple-500/30"} group-hover:shadow-lg transition-shadow flex items-center justify-center`}
                >
                  {isAdmin && (
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  )}
                </div>
                <span
                  className={`text-sm sm:text-base lg:text-xl font-bold ${isAdmin ? "text-white" : `bg-gradient-to-r ${brandColors.primary} bg-clip-text text-transparent`} truncate max-w-[80px] sm:max-w-[120px] lg:max-w-none`}
                >
                  {isAdmin ? "Admin" : "CreatorMarket"}
                </span>
              </Link>

              {/* Desktop Navigation - Visible from md screens */}
              <nav className="hidden lg:flex items-center gap-0.5 lg:gap-1 overflow-x-auto flex-1 min-w-0">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? isAdmin
                            ? "bg-white/10 text-white shadow-md border border-white/20"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                          : isAdmin
                            ? "text-slate-300 hover:bg-white/5 hover:text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                      <span className="hidden lg:inline">{item.name}</span>
                      {/* Show abbreviated names on md screens */}
                      <span className="lg:hidden">
                        {item.name === "Dashboard"
                          ? "Dash"
                          : item.name === "Transactions"
                            ? "Txns"
                            : item.name === "Approvals"
                              ? "Appr"
                              : item.name === "Analytics"
                                ? "Anal"
                                : item.name === "Customers"
                                  ? "Cust"
                                  : item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Desktop Actions - Visible from sm screens */}
              <div className="hidden sm:flex items-center gap-1 lg:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-1 lg:gap-2 px-2 lg:px-3 ${isAdmin ? "border-slate-600 bg-white/5 text-slate-200 hover:bg-white/10" : "border-gray-200 hover:bg-gray-50"} whitespace-nowrap`}
                >
                  <Download className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  <span className="hidden lg:inline">Export</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`relative h-8 w-8 lg:h-9 lg:w-9 ${isAdmin ? "border-slate-600 bg-white/5 hover:bg-white/10" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <Bell
                        className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${isAdmin ? "text-slate-200" : ""}`}
                      />
                      {notifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-3.5 w-3.5 lg:h-4 lg:w-4 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 border-2 border-white text-[8px] lg:text-[10px]">
                          {notifications}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 sm:w-72 lg:w-80"
                  >
                    <DropdownMenuLabel className="text-xs lg:text-sm">
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-y-auto">
                      <DropdownMenuItem className="flex flex-col items-start p-2 lg:p-3 cursor-pointer">
                        <div className="flex items-start gap-2 w-full">
                          <div
                            className={`h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full ${isAdmin ? "bg-orange-500" : "bg-blue-500"} mt-1.5 flex-shrink-0`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs lg:text-sm truncate">
                              {isAdmin
                                ? "New Creator Application"
                                : "New Order Received"}
                            </p>
                            <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {isAdmin
                                ? "Jordan Lee applied for creator verification"
                                : "Alex Johnson ordered Premium Creator Hoodie"}
                            </p>
                            <p className="text-[10px] lg:text-xs text-gray-400 mt-0.5">
                              5 min ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center text-purple-600 font-medium cursor-pointer text-xs lg:text-sm">
                      View All
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-1 lg:gap-2 ${isAdmin ? "hover:bg-white/5" : "hover:bg-gray-50"} px-1.5 lg:px-2 h-8 lg:h-9`}
                  >
                    <Avatar className="h-6 w-6 lg:h-8 lg:w-8 border-2 border-purple-100">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback
                        className={`bg-gradient-to-br ${brandColors.primary} text-white text-[10px] lg:text-xs`}
                      >
                        {isAdmin ? "AD" : "CR"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p
                        className={`text-xs font-semibold ${isAdmin ? "text-white" : ""}`}
                      >
                        {isAdmin ? "Admin User" : "Creator Name"}
                      </p>
                      <p
                        className={`text-[10px] ${isAdmin ? "text-slate-300" : "text-gray-500"}`}
                      >
                        {isAdmin ? "Admin" : "Creator"}
                      </p>
                    </div>
                    <div className="hidden sm:block lg:hidden text-left">
                      <p
                        className={`text-xs font-semibold ${isAdmin ? "text-white" : ""}`}
                      >
                        {isAdmin ? "Admin" : "Creator"}
                      </p>
                    </div>
                    <MoreVertical
                      className={`h-3 w-3 lg:h-4 lg:w-4 ${isAdmin ? "text-slate-300" : "text-gray-400"}`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 lg:w-56">
                  <DropdownMenuLabel className="text-xs lg:text-sm">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-xs lg:text-sm">
                    <Settings className="mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-xs lg:text-sm">
                    <HelpCircle className="mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    Help
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-xs lg:text-sm">
                        <Shield className="mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                        Switch to Creator
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 text-xs lg:text-sm">
                    <LogOut className="mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button - Visible only on small screens */}
              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden h-8 w-8 ${isAdmin ? "text-white hover:bg-white/5" : ""}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t ${isAdmin ? "bg-slate-800 border-slate-700" : "bg-white"}`}
          >
            <nav className="px-3 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? isAdmin
                          ? "bg-white/10 text-white shadow-md border border-white/20"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                        : isAdmin
                          ? "text-slate-300 hover:bg-white/5"
                          : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile-only action items */}
              <div
                className={`pt-4 mt-2 border-t ${isAdmin ? "border-slate-700" : "border-gray-100"}`}
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 gap-2 text-xs ${isAdmin ? "border-slate-600 bg-white/5 text-slate-200" : ""}`}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`relative h-8 w-8 ${isAdmin ? "border-slate-600 bg-white/5" : ""}`}
                  >
                    <Bell
                      className={`h-3.5 w-3.5 ${isAdmin ? "text-slate-200" : ""}`}
                    />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-3.5 w-3.5 p-0 bg-gradient-to-r from-red-500 to-pink-500 text-[8px]">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search and Filters Bar */}
      {(showSearch || showFilters) && (
        <div
          className={`border-b ${isAdmin ? "bg-slate-800/60 border-slate-700" : "bg-white/60"} backdrop-blur-xl`}
        >
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              {showSearch && (
                <div className="flex-1 w-full">
                  <div className="relative max-w-xl w-full">
                    <Search
                      className={`absolute left-3 top-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 -translate-y-1/2 ${isAdmin ? "text-slate-200" : "text-gray-400"}`}
                    />
                    <Input
                      placeholder={`Search ${isAdmin ? "creators, products..." : "products, orders..."}`}
                      className={`pl-8 lg:pl-9 ${
                        isAdmin
                          ? "bg-slate-700 border-slate-500 text-white placeholder:text-slate-200"
                          : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-500"
                      } focus:ring-2 focus:ring-purple-500/30 focus:border-transparent w-full text-xs lg:text-sm h-8 lg:h-9`}
                    />
                  </div>
                </div>
              )}

              {showFilters && (
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <div className="flex flex-wrap items-center gap-2 flex-1 lg:flex-none">
                    <Select defaultValue="all">
                      <SelectTrigger
                        className={`w-full sm:w-[130px] lg:w-[140px] ${isAdmin ? "bg-slate-700/50 border-slate-600 text-white" : "border-gray-200 bg-white"} h-8 lg:h-9 text-xs lg:text-sm`}
                      >
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs lg:text-sm">
                          All Categories
                        </SelectItem>
                        <SelectItem
                          value="digital"
                          className="text-xs lg:text-sm"
                        >
                          Digital
                        </SelectItem>
                        <SelectItem
                          value="physical"
                          className="text-xs lg:text-sm"
                        >
                          Physical
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="30days">
                      <SelectTrigger
                        className={`w-full sm:w-[130px] lg:w-[140px] ${isAdmin ? "bg-slate-700/50 border-slate-600 text-white" : "border-gray-200 bg-white"} h-8 lg:h-9 text-xs lg:text-sm`}
                      >
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="7days"
                          className="text-xs lg:text-sm"
                        >
                          Last 7 days
                        </SelectItem>
                        <SelectItem
                          value="30days"
                          className="text-xs lg:text-sm"
                        >
                          Last 30 days
                        </SelectItem>
                        <SelectItem
                          value="90days"
                          className="text-xs lg:text-sm"
                        >
                          Last 90 days
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`${isAdmin ? "bg-slate-700/50 border-slate-600 text-slate-200" : "border-gray-200 bg-white"} h-8 w-8 lg:h-9 lg:w-9`}
                    >
                      <Filter className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    </Button>

                    <Button
                      className={`bg-gradient-to-r ${brandColors.primary} hover:opacity-90 shadow-lg ${isAdmin ? "shadow-purple-500/20" : "shadow-purple-500/30"} h-8 lg:h-9 px-3 text-xs lg:text-sm whitespace-nowrap`}
                    >
                      {isAdmin ? "Add User" : "Add Product"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">{children}</main>

      {/* Footer */}
      <footer
        className={`mt-8 sm:mt-12 border-t ${isAdmin ? "bg-slate-900/60 border-slate-700" : "bg-white/60"} backdrop-blur-xl`}
      >
        <div className="px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div
                  className={`h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br ${brandColors.gradient}`}
                />
                <span
                  className={`font-bold ${isAdmin ? "text-white" : "text-gray-900"} text-sm sm:text-base`}
                >
                  {isAdmin ? "Admin" : "CreatorMarket"}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm ${isAdmin ? "text-slate-400" : "text-gray-500"}`}
              >
                {isAdmin ? "Platform management" : "Empowering creators"}
              </p>
            </div>
            <div>
              <h3
                className={`font-semibold text-xs sm:text-sm lg:text-base mb-2 sm:mb-4 ${isAdmin ? "text-white" : ""}`}
              >
                Links
              </h3>
              <ul
                className={`space-y-1.5 sm:space-y-2 text-xs sm:text-sm ${isAdmin ? "text-slate-300" : "text-gray-600"}`}
              >
                <li>
                  <Link
                    href="#"
                    className={`${isAdmin ? "hover:text-purple-400" : "hover:text-purple-600"}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`${isAdmin ? "hover:text-purple-400" : "hover:text-purple-600"}`}
                  >
                    {isAdmin ? "Creators" : "Products"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`${isAdmin ? "hover:text-purple-400" : "hover:text-purple-600"}`}
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3
                className={`font-semibold text-xs sm:text-sm lg:text-base mb-2 sm:mb-4 ${isAdmin ? "text-white" : ""}`}
              >
                Support
              </h3>
              <ul
                className={`space-y-1.5 sm:space-y-2 text-xs sm:text-sm ${isAdmin ? "text-slate-300" : "text-gray-600"}`}
              >
                <li>
                  <Link
                    href="#"
                    className={`${isAdmin ? "hover:text-purple-400" : "hover:text-purple-600"}`}
                  >
                    Help
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`${isAdmin ? "hover:text-purple-400" : "hover:text-purple-600"}`}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3
                className={`font-semibold text-xs sm:text-sm lg:text-base mb-2 sm:mb-4 ${isAdmin ? "text-white" : ""}`}
              >
                Legal
              </h3>
              <ul
                className={`space-y-1.5 sm:space-y-2 text-xs sm:text-sm ${isAdmin ? "text-slate-300" : "text-gray-600"}`}
              >
                <li>
                  <Link
                    href="#"
                    className={`${isAdmin ? "hover:text-purple-400" : "hover:text-purple-600"}`}
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`${isAdmin ? "hover:text-purple-400" : "hover:text-purple-600"}`}
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`mt-6 sm:mt-8 pt-4 sm:pt-8 border-t ${isAdmin ? "border-slate-700" : ""} text-center text-xs sm:text-sm ${isAdmin ? "text-slate-400" : "text-gray-500"}`}
          >
            <p>&copy; 2024 {isAdmin ? "Admin Panel" : "CreatorMarket"}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
