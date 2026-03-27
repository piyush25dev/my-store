"use client";

import { usePathname } from "next/navigation";
import { products } from "@/app/data/product";
import { BackgroundDecorations } from "./BackgroundDecorations";
import { StoreHeader } from "./StoreHeader";
import { FeaturedProduct } from "./FeaturedProduct";
import { ProductCollection } from "./ProductCollection";
import { FooterCTA } from "./FooterCTA";

export default function StorePremium() {
  const pathname = usePathname();
  const featured = products.find((p) => p.featured);
  const collection = products.filter((p) => !p.featured);

  const getProductLink = (productId) => {
    return `/product/${productId}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <BackgroundDecorations />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <StoreHeader />
        
        <FeaturedProduct 
          product={featured} 
          getProductLink={getProductLink} 
        />
        
        <ProductCollection 
          products={collection} 
          getProductLink={getProductLink} 
        />
        
        <FooterCTA />
      </div>
    </main>
  );
}