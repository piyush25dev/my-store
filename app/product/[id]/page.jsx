import ProductIndex from '@/components/direction-3-premium/Product/ProductIndex'
import { products } from "@/app/data/product";
import React from 'react'
import { ProductNotFound } from '@/components/ui/not-found';

export default async function ProductPage({ params }) {
   const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <ProductNotFound backUrl="/store" />;
  }
  const related = products.filter((p) => p.id !== id).slice(0, 4);
  return (
    <div>
      <ProductIndex product={product} related={related}/>
    </div>
  )
}
