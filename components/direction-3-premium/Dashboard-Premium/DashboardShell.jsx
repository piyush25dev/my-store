"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Plus,
  Home,
  Package,
  ShoppingCart,
  Settings,
  Users,
  LayoutDashboard,
  BarChart,
  Store,
  SquareActivity,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Tab configurations for each role
const ROLE_TABS = {
  customer: [
    { label: "Overview", icon: Home, slug: "overview" },
    { label: "Orders", icon: ShoppingCart, slug: "orders" },
    { label: "Wishlist", icon: Store, slug: "wishlist" },
    { label: "Settings", icon: Settings, slug: "settings" },
  ],
  creator: [
    { label: "Overview", icon: Home, slug: "overview" },
    { label: "Products", icon: Package, slug: "products" },
    { label: "Orders", icon: ShoppingCart, slug: "orders" },
    { label: "Analytics", icon: BarChart, slug: "analytics" },
    { label: "Settings", icon: Settings, slug: "settings" },
  ],
  admin: [
    { label: "Overview", icon: LayoutDashboard, slug: "overview" },
    { label: "Users", icon: Users, slug: "users" },
    { label: "Orders", icon: ShoppingCart, slug: "orders" },
    { label: "Analytics", icon: BarChart, slug: "analytics" },
    { label: "Settings", icon: Settings, slug: "settings" },
    { label: "Moderation", icon: SquareActivity, slug: "moderation" },
  ],
};

export default function DashboardShell({
  children,
  // Support both old (isAdmin) and new (role) props
  isAdmin = false,
  role = null,
  activeTab = 0,
  onTabChange, // (slug: string, index: number) => void
}) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  // Determine role: prefer new 'role' prop, fallback to 'isAdmin'
  let currentRole = role;
  if (!currentRole) {
    currentRole = isAdmin ? "admin" : "creator";
  }

  // Get tabs for current role
  const navItems = ROLE_TABS[currentRole] || ROLE_TABS.creator;

  // Determine action button based on role
  const getActionButton = () => {
    switch (currentRole) {
      case "admin":
        return { icon: Users, label: "New Creator" };
      case "creator":
        return { icon: Plus, label: "New Product" };
      case "customer":
        return { icon: Plus, label: "Browse Products" };
      default:
        return { icon: Plus, label: "New" };
    }
  };

  const actionButton = getActionButton();
  const ActionIcon = actionButton.icon;

  // Get display title based on role
  const getTitle = () => {
    switch (currentRole) {
      case "admin":
        return "Admin Panel";
      case "creator":
        return "Creator Studio";
      case "customer":
        return "My Dashboard";
      default:
        return "Dashboard";
    }
  };

  const title = getTitle();

  const handleTab = (i) => {
    onTabChange?.(navItems[i].slug, i);
  };

  const handleLogout = async () => {
    await signOut();
    setShowLogoutMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* ── Desktop header ─────────────────────────────────────────────────── */}
      <header className="hidden md:block sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center gap-6 lg:gap-8 justify-between"> */}
              <div>
                <h1 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight">
                  {title}
                </h1>
                <p className="text-xs text-slate-500 capitalize mt-0.5">
                  {currentRole} account
                </p>
              </div>

              <nav className="flex items-center gap-1 bg-slate-100/50 rounded-full p-1.5">
                {navItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.slug}
                      onClick={() => handleTab(i)}
                      className={`
                        flex items-center gap-2 px-2 lg:px-3 py-2 lg:py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${
                          activeTab === i
                            ? "bg-white text-slate-900 shadow-lg shadow-slate-200/50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            {/* </div> */}

            {/* <div className="flex items-center gap-3">
              <Button
              onClick={()=> router.push('/')}
              className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white shadow-lg shadow-slate-900/20 rounded-full px-2 lg:px-4 text-sm">
                <ActionIcon className="w-4 h-4" />
                <span className="hidden lg:inline">{actionButton.label}</span>
              </Button>

              <div className="relative">
                <button
                  onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all duration-300"
                  title="Account menu"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {showLogoutMenu && (
                  <div className="absolute right-0 mt-2 bg-white border border-slate-200/60 rounded-lg shadow-lg p-2 min-w-[160px] z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-all duration-300 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </header>

      {/* ── Mobile header ──────────────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-base font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-[10px] text-slate-400">
              {navItems[activeTab]?.label}
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button
            onClick={()=> router.push('/')}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg h-9 w-9 p-0"
            >
              <ActionIcon className="w-4 h-4" />
            </Button>

           
            <button
              onClick={handleLogout}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div> */}
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 md:pb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-4 sm:p-5 md:p-6 lg:p-8 min-h-[calc(100vh-160px)] md:min-h-[600px]">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ──────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-2xl">
        <div className="flex justify-between overflow-x-auto px-2 py-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = activeTab === i;

            return (
              <button
                key={item.slug}
                onClick={() => handleTab(i)}
                className="
        flex flex-col items-center gap-1 py-2 px-3
        min-w-[64px] flex-shrink-0
        rounded-xl transition-all duration-300
      "
              >
                <div
                  className={`
          p-1.5 rounded-lg transition-all duration-300
          ${active ? "bg-slate-900 text-white shadow-lg" : "text-slate-400"}
        `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <span
                  className={`
          text-[10px] font-medium whitespace-nowrap
          ${active ? "text-slate-900" : "text-slate-500"}
        `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}