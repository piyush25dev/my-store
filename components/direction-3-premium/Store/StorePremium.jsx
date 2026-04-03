"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BackgroundDecorations } from "./BackgroundDecorations";
import { StoreHeader } from "./StoreHeader";
import { FeaturedProduct } from "./FeaturedProduct";
import { ProductCollection } from "./ProductCollection";
import { FooterCTA } from "./FooterCTA";

export default function StorePremium() {
  const pathname = usePathname();
  const [featured, setFeatured] = useState(null);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured product
        const featuredRes = await fetch('/api/products?featured=true');
        if (!featuredRes.ok) throw new Error('Failed to fetch featured product');
        const featuredData = await featuredRes.json();
        
        // Transform API data to match the expected product format
        const featuredProduct = featuredData.products?.[0] 
          ? transformProduct(featuredData.products[0]) 
          : null;
        setFeatured(featuredProduct);

        // Fetch collection (non-featured products)
        const collectionRes = await fetch('/api/products?featured=false&limit=20');
        if (!collectionRes.ok) throw new Error('Failed to fetch collection');
        const collectionData = await collectionRes.json();
        
        // Transform collection data
        const transformedCollection = (collectionData.products || [])
          .map(transformProduct);
        setCollection(transformedCollection);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Transform API product format to match the expected component format
  const transformProduct = (apiProduct) => {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      tagline: apiProduct.short_description || apiProduct.description?.substring(0, 100),
      price: (apiProduct.price / 100).toLocaleString('en-IN'),
      originalPrice: apiProduct.original_price 
        ? (apiProduct.original_price / 100).toLocaleString('en-IN') 
        : null,
      image: apiProduct.product_images?.[0]?.image_url,
      type: apiProduct.category?.name || 'Product',
      in_stock: apiProduct.in_stock || false,
      featured: apiProduct.featured || false,
      slug: apiProduct.slug,
      description: apiProduct.description,
    };
  };

  const getProductLink = (productId) => {
    const product = collection.find(p => p.id === productId) || featured;
    return `/product/${product?.slug || productId}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="rounded-full bg-red-100 p-4 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

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