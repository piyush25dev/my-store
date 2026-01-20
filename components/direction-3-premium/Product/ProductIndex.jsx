import { use } from 'react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { products } from "@/app/data/product";
import { ProductNotFound } from '@/components/ui/not-found';
import { ProductHero } from './Components/product-hero';
import { ProductHeader } from './Components/product-header';
import { PricingSection } from './Components/pricing-section';
import { VariantSelector } from './Components/variant-selector';
import { ProductActions } from './Components/product-actions';
import { TrustBadges } from './Components/trust-badges';
import { ProductTabs } from './Components/product-tabs';
import { RelatedProducts } from './Components/related-products';

export default async function ProductIndex({ params }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <ProductNotFound backUrl="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-rose-50/20">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-rose-100/20 to-pink-100/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-gray-100/10 to-white/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6 lg:mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <ProductHero product={product} />

          {/* Product Details */}
          <div className="space-y-6 lg:space-y-8">
            <ProductHeader product={product} />
            <PricingSection product={product} />
            
            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <VariantSelector variants={product.variants} />
            )}

            {/* Action Buttons */}
            <ProductActions product={product} />

            {/* Trust Badges */}
            <TrustBadges />
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 lg:p-8">
            <ProductTabs product={product} />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          products={products} 
          currentProductId={product.id} 
        />
      </div>
    </div>
  );
}