"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  BarChart3,
  FileText,
  ExternalLink,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  Download,
  Globe,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
  children,
  type = "creator", // "creator" or "admin"
  title = "Dashboard",
  subtitle = "Welcome back!",
  headerButtons = null,
  showSearch = false,
  showNotifications = false,
  userInitial = "A",
  userName = "Admin",
  platformStatus = true,
  menuItems = [],
  sidebarContent = null,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const defaultMenuItems = type === "creator" 
    ? [
        { icon: <Home className="w-4 h-4" />, label: "Dashboard", active: true },
        { icon: <Package className="w-4 h-4" />, label: "Products" },
        { icon: <ShoppingCart className="w-4 h-4" />, label: "Orders" },
        { icon: <DollarSign className="w-4 h-4" />, label: "Revenue" },
        { icon: <Users className="w-4 h-4" />, label: "Customers" },
        { icon: <FileText className="w-4 h-4" />, label: "Content" },
        { icon: <Settings className="w-4 h-4" />, label: "Settings" },
      ]
    : [
        { icon: <Home className="w-4 h-4" />, label: "Overview", active: true },
        { icon: <Users className="w-4 h-4" />, label: "Creators" },
        { icon: <Package className="w-4 h-4" />, label: "Products" },
        { icon: <ShoppingCart className="w-4 h-4" />, label: "Orders" },
        { icon: <DollarSign className="w-4 h-4" />, label: "Payouts" },
        { icon: <BarChart3 className="w-4 h-4" />, label: "Analytics" },
        { icon: <Settings className="w-4 h-4" />, label: "Settings" },
      ];

  const itemsToUse = menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="sticky top-0 z-50 h-16 border-b bg-white px-4 md:px-6">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2">
              {type === "admin" && (
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              )}
              <h1 className="font-bold text-sm md:text-xl">
                {type === "admin" ? "Admin Portal" : "Creator Studio"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showSearch && (
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            )}
            {showNotifications && (
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
            )}
            {(showSearch || showNotifications) && (
              <Separator orientation="vertical" className="h-6" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                    {userInitial}
                  </div>
                  <span className="hidden md:inline">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Fixed Sidebar */}
        <aside
          className={`fixed md:sticky md:top-16 z-40 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] w-64 border-r bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <nav className="p-4 space-y-1">
              {itemsToUse.map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                >
                  {item.icon}
                  {item.label}
                  {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Button>
              ))}
            </nav>

            <Separator className="my-4" />

            <div className="px-4 space-y-4">
              {platformStatus && (
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                  <h3 className="font-medium text-sm mb-2">Platform Status</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">All systems operational</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Globe className="w-3 h-3 mr-2" />
                    View Status
                  </Button>
                </div>
              )}

              {type === "creator" && (
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Public Store
                </Button>
              )}

              {type === "admin" && (
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Export Reports
                </Button>
              )}

              {sidebarContent}
            </div>
          </div>
        </aside>

        {/* Main Content - Scrolls independently */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                {headerButtons}
              </div>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}