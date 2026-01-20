import React from 'react'
import Link from 'next/link'
import { Crown, Store, ArrowRight, LayoutGrid } from 'lucide-react'

export default function Navigation() {
  const directions = [
    {
      name: 'Minimal',
      description: 'Clean and simple design with focus on content',
      path: '/mockups/direction-1-minimal',
      icon: LayoutGrid,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50',
      pages: [
        { name: 'Store', path: '/store' },
        { name: 'Creator Dashboard', path: '/creator-dashboard' },
        { name: 'Admin Dashboard', path: '/admin-dashboard' }
      ]
    },
    {
      name: 'Marketplace',
      description: 'Vibrant marketplace experience with rich features',
      path: '/mockups/direction-2-marketplace',
      icon: Store,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50',
      pages: [
        { name: 'Store', path: '/store' },
        { name: 'Creator Dashboard', path: '/creator-dashboard' },
        { name: 'Admin Dashboard', path: '/admin-dashboard' }
      ]
    },
    {
      name: 'Premium',
      description: 'Luxury design with sophisticated aesthetics',
      path: '/mockups/direction-3-premium',
      icon: Crown,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50',
      pages: [
        { name: 'Store', path: '/store' },
        { name: 'Creator Dashboard', path: '/dashboard/creator' },
        { name: 'Admin Dashboard', path: '/dashboard/admin' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight">
            Design Directions
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Explore three unique design approaches for your marketplace experience
          </p>
        </div>
        
        {/* Direction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {directions.map((direction) => {
            const Icon = direction.icon;
            return (
              <div 
                key={direction.path} 
                className="group relative overflow-hidden rounded-2xl lg:rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${direction.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-6 sm:p-8 space-y-4 sm:space-y-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${direction.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                      {direction.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {direction.description}
                    </p>
                  </div>
                  
                  {/* Links */}
                  <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4 border-t border-slate-200/60">
                    {/* <Link 
                      href={direction.path}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-slate-100/50 to-slate-50/50 hover:from-slate-100 hover:to-slate-50 transition-all duration-300 group/link"
                    >
                      <span className="text-sm sm:text-base font-semibold text-slate-900">
                        View Overview
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link> */}
                    
                    {direction.pages.map((page) => (
                      <Link 
                        key={page.path}
                        href={`${direction.path}${page.path}`}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-white/80 transition-all duration-300 group/link"
                      >
                        <span className="text-sm sm:text-base text-slate-700 group-hover/link:text-slate-900 font-medium transition-colors">
                          {page.name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover/link:text-slate-600 group-hover/link:translate-x-1 transition-all duration-300" />
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Decorative Element */}
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br ${direction.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
              </div>
            );
          })}
        </div>
        
        {/* Footer Note */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            Click on any direction to explore the design in detail
          </p>
        </div>
      </div>
    </div>
  )
}