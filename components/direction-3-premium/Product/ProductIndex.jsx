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
            href="/mockups/direction-3-premium/store" 
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

// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { products } from "@/app/data/product";
// import { ProductNotFound } from "@/components/ui/not-found";

// import { V2ProductHeader } from "./Components1/V2ProductHeader";
// import { V2PurchasePanel } from "./Components1/V2PurchasePanel";
// import { V2SellerCard } from "./Components1/V2SellerCard";
// import { V2StatsPanel } from "./Components1/V2SellerCard";
// import { V2ProductTabs } from "./Components1/V2ProductTabs";
// import { V2RelatedProducts } from "./Components1/V2RelatedProducts";

// export default async function ProductPageV2({ params }) {
//   const { id } = await params;
//   const product = products.find((p) => p.id === id);

//   if (!product) return <ProductNotFound backUrl="/store" />;

//   const related = products.filter((p) => p.id !== id).slice(0, 4);

//   return (
//     <div className="min-h-screen bg-[#faf9f7]">
//       {/* Subtle texture overlay */}
//       <div
//         className="fixed inset-0 -z-10 opacity-[0.015]"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//         }}
//       />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
//         {/* Back nav */}
//         <Link
//           href="/mockups/direction-3-premium/store"
//           className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors group mb-8"
//         >
//           <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
//           <span className="font-sans">Back to Store</span>
//         </Link>

//         {/* 3-column layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* ── Left column (spans 2) ──────────────────────────────────── */}
//           <div className="lg:col-span-2 space-y-8">
//             <V2ProductHeader product={product} />
//             <V2SellerCard />
//             <V2ProductTabs product={product} />
//             <V2RelatedProducts products={related} />
//           </div>

//           {/* ── Right column: sticky sidebar ──────────────────────────── */}
//           <div className="space-y-5">
//             <V2PurchasePanel product={product} />
//             <V2StatsPanel />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }