"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Home, Package, ShoppingCart, Settings, Users, LayoutDashboard, BarChart, Store } from 'lucide-react';

export default function DashboardShell({ children, isAdmin = false }) {
  const [activeTab, setActiveTab] = React.useState(0);

  const navItems = isAdmin
    ? [
        { label: "Overview", icon: LayoutDashboard },
        { label: "Creators", icon: Users },
        { label: "Orders", icon: ShoppingCart },
        { label: "Analytics", icon: BarChart },
        { label: "Settings", icon: Settings }
      ]
    : [
        { label: "Overview", icon: Home },
        { label: "Products", icon: Package },
        { label: "Orders", icon: ShoppingCart },
        { label: "Store", icon: Store },
        { label: "Settings", icon: Settings }
      ];

  const newItemButtonText = isAdmin ? "New Creator" : "New Product";
  const newItemButtonIcon = isAdmin ? Users : Plus;

  const NewItemIcon = newItemButtonIcon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* Desktop Top Bar */}
      <header className="hidden md:block sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 lg:gap-8">
              <h1 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight">
                {isAdmin ? "Admin Dashboard" : "Creator Studio"}
              </h1>
              
              <nav className="flex items-center gap-1 bg-slate-100/50 rounded-full p-1.5">
                {navItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(i)}
                      className={`
                        flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm font-medium transition-all duration-300
                        ${activeTab === i 
                          ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <Button 
              className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white shadow-lg shadow-slate-900/20 rounded-full px-4 lg:px-6 text-sm"
            >
              <NewItemIcon className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">{newItemButtonText}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-base font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {isAdmin ? "Admin Panel" : "Creator Studio"}
          </h1>
          <Button 
            size="sm" 
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg shadow-slate-900/20 h-9 w-9 p-0"
          >
            <NewItemIcon className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 pb-24 md:pb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-4 sm:p-5 md:p-6 lg:p-8 min-h-[calc(100vh-180px)] md:min-h-[600px]">
          {children || (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-16 md:py-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 sm:mb-6">
                {isAdmin ? (
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                ) : (
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                {isAdmin ? "Welcome to Admin Dashboard" : "Welcome to Creator Studio"}
              </h3>
              <p className="text-sm sm:text-base text-slate-500 max-w-md px-4">
                {isAdmin 
                  ? "Manage creators, view platform analytics, and configure system settings from here." 
                  : "Get started by creating your first product or exploring the features available to you."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-2xl shadow-slate-900/5 safe-area-inset-bottom">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(i)}
                className={`
                  flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-300
                  ${activeTab === i 
                    ? 'text-slate-900' 
                    : 'text-slate-400'
                  }
                `}
              >
                <div className={`
                  p-1.5 rounded-lg transition-all duration-300
                  ${activeTab === i 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30' 
                    : 'bg-transparent'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-medium leading-tight ${activeTab === i ? 'text-slate-900' : 'text-slate-500'}`}>
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