'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

// V2 Components (Premium Layout - Sidebar)
import { V2ProductHeader } from "./Components1/V2ProductHeader";
import { V2PurchasePanel } from "./Components1/V2PurchasePanel";
import { V2SellerCard } from "./Components1/V2SellerCard";
import { V2StatsPanel } from "./Components1/V2SellerCard";
import { V2ProductTabs } from "./Components1/V2ProductTabs";
import { V2RelatedProducts } from "./Components1/V2RelatedProducts";

// V1 Components (Standard Layout - Grid)
import { ProductHero } from './Components/product-hero';
import { ProductHeader } from './Components/product-header';
import { PricingSection } from './Components/pricing-section';
import { VariantSelector } from './Components/variant-selector';
import { ProductActions } from './Components/product-actions';
import { TrustBadges } from './Components/trust-badges';
import { ProductTabs } from './Components/product-tabs';
import { RelatedProducts } from './Components/related-products';

export default function UnifiedProductPageClient({ product, related }) {
  const [viewMode, setViewMode] = useState('v2');
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // ── Fetch user role ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoadingRole(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setUserRole(null);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user role:", profileError);
          setUserRole(null);
          return;
        }

        setUserRole(profileData?.user_role || null);
      } catch (err) {
        console.error("Error in fetchUserRole:", err);
        setUserRole(null);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, []);

  // ── Check if user is creator or admin ────────────────────────────────
  const shouldHidePurchasePanel = userRole === 'creator' || userRole === 'admin';

  // ──── V2 LAYOUT (Premium) ────
  if (viewMode === 'v2') {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        {/* Subtle texture overlay */}
        <div
          className="fixed inset-0 -z-10 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header with back nav and toggle */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-sans">Back to Store</span>
            </Link>
            
            {/* Design Toggle */}
            <DesignToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          {/* 
            Adjusted grid layout:
            - If purchase panel hidden: content takes 1 column (full width)
            - If purchase panel visible: 3-column layout (2 cols content + 1 col sidebar)
          */}
          <div className={`grid ${shouldHidePurchasePanel ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-8`}>
            {/* ── Left/main column ──────────────────────────────────── */}
            <div className={`space-y-8 ${shouldHidePurchasePanel ? '' : 'lg:col-span-2'}`}>
              <V2ProductHeader product={product} />
              <V2SellerCard product={product} />
              <V2ProductTabs product={product} />
              <V2RelatedProducts products={related} />
            </div>

            {/* ── Right column: sticky sidebar (only show if not creator/admin) ──────────────── */}
            {!shouldHidePurchasePanel && !loadingRole && (
              <div className="space-y-5">
                <V2PurchasePanel product={product} />
                <V2StatsPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ──── V1 LAYOUT (Standard) ────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-rose-50/20">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-rose-100/20 to-pink-100/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-gray-100/10 to-white/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation with toggle */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </Link>
          
          {/* Design Toggle */}
          <DesignToggle viewMode={viewMode} setViewMode={setViewMode} />
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

            {/* Action Buttons (only show if NOT creator/admin) */}
            {!shouldHidePurchasePanel && !loadingRole && (
              <ProductActions product={product} />
            )}

            {/* Trust Badges */}
            <TrustBadges />
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-300/30 p-6 lg:p-8">
            <ProductTabs product={product} />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          products={related} 
          currentProductId={product.id} 
        />
      </div>
    </div>
  );
}

/**
 * Elegant toggle component to switch between design versions
 */
function DesignToggle({ viewMode, setViewMode }) {
  return (
    <div className="relative inline-flex items-center p-1.5 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 backdrop-blur-sm border border-gray-300/50 shadow-lg">
      {/* Inner subtle border for depth */}
      <div className="absolute inset-0 rounded-full border border-white/50 pointer-events-none" />

      {/* Background slider with 3D effect */}
      <div
        className="absolute inset-1.5 rounded-full bg-gradient-to-b from-white to-gray-100 shadow-inner transition-all duration-500 ease-out"
        style={{
          left: viewMode === 'v1' ? 'calc(50% + 2px)' : '6px',
          right: viewMode === 'v1' ? '6px' : 'calc(50% + 2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      />

      {/* V2 Button */}
      <button
        onClick={() => setViewMode('v2')}
        className={`relative px-3 py-2.5 md:px-4 rounded-full text-sm font-medium transition-all duration-300 transform ${
          viewMode === 'v2'
            ? 'text-gray-900 drop-shadow-md scale-105'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <span className="flex items-center gap-0 md:gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          </svg>
          <span className="hidden md:inline">Premium</span>
        </span>
      </button>

      {/* V1 Button */}
      <button
        onClick={() => setViewMode('v1')}
        className={`relative px-3 py-2.5 md:px-4 rounded-full text-sm font-medium transition-all duration-300 transform ${
          viewMode === 'v1'
            ? 'text-gray-900 drop-shadow-md scale-105'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <span className="flex items-center gap-0 md:gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4m0-18v18m0-18h10a2 2 0 012 2v14a2 2 0 01-2 2h-10" />
          </svg>
          <span className="hidden md:inline">Standard</span>
        </span>
      </button>
    </div>
  );
}