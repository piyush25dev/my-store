import ProductMarketplace from '@/components/direction-2-marketplace/Product/ProductIndex'
import React from 'react'

export default function page({ params }) {
  return (
    <div>
      <ProductMarketplace params={params} />
    </div>
  )
}
