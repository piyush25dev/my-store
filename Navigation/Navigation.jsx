import React from 'react'
import Link from 'next/link'

export default function Navigation() {
  const directions = [
    {
      name: 'Direction 1 - Minimal',
      path: '/mockups/direction-1-minimal',
      pages: [
        { name: 'Store', path: '/store' },
        { name: 'Product', path: '/product' },
        { name: 'Checkout', path: '/checkout' },
        { name: 'Admin Dashboard', path: '/admin-dashboard' },
        { name: 'Creator Dashboard', path: '/creator-dashboard' },
      ]
    },
    {
      name: 'Direction 2 - Marketplace',
      path: '/mockups/direction-2-marketplace',
      pages: [
        { name: 'Store', path: '/store' },
        { name: 'Product', path: '/product' },
        { name: 'Checkout', path: '/checkout' },
        { name: 'Dashboard', path: '/dashboard' }
      ]
    },
    {
      name: 'Direction 3 - Premium',
      path: '/mockups/direction-3-premium',
      pages: [
        { name: 'Store', path: '/store' },
        { name: 'Product', path: '/product' },
        { name: 'Checkout', path: '/checkout' },
        { name: 'Dashboard', path: '/dashboard' }
      ]
    }
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Mockup Directions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {directions.map((direction) => (
          <div key={direction.path} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{direction.name}</h2>
            
            <ul className="space-y-2">
              <li>
                <Link 
                  href={direction.path}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Overview
                </Link>
              </li>
              
              {direction.pages.map((page) => (
                <li key={page.path} className="ml-4">
                  <Link 
                    href={`${direction.path}${page.path}`}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}