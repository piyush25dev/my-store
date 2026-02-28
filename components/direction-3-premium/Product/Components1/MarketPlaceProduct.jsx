import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { products } from "@/app/data/product";
import { ProductNotFound } from "@/components/ui/not-found";

import { V2ProductHeader } from "./V2ProductHeader";
import { V2PurchasePanel } from "./V2PurchasePanel";
import { V2SellerCard } from "./V2SellerCard";
import { V2StatsPanel } from "./V2SellerCard";
import { V2ProductTabs } from "./V2ProductTabs";
import { V2RelatedProducts } from "./V2RelatedProducts";

export default async function ProductPageV2({ params }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) return <ProductNotFound backUrl="/store" />;

  const related = products.filter((p) => p.id !== id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Subtle texture overlay */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors group mb-8"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans">Back to Store</span>
        </Link>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column (spans 2) ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            <V2ProductHeader product={product} />
            <V2SellerCard />
            <V2ProductTabs product={product} />
            <V2RelatedProducts products={related} />
          </div>

          {/* ── Right column: sticky sidebar ──────────────────────────── */}
          <div className="space-y-5">
            <V2PurchasePanel product={product} />
            <V2StatsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}