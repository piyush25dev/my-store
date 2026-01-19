import ProductMinimal from '@/components/direction-1-minimal/product'
import React from 'react'

export default async function page({ params }) {
  return (
    <div>
      <ProductMinimal params={params}/>
    </div>
  )
}
