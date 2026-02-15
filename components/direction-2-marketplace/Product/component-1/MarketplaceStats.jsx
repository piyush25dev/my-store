// ── MarketplaceStats ──────────────────────────────────────────────────────────

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STATS = [
  { label: "Sales", value: "1,247" },
  { label: "Downloads", value: "2,891" },
  { label: "Rating", value: "4.8", icon: <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> },
  { label: "Last Updated", value: "2 days ago" },
];

export function MarketplaceStats() {
  return (
    <Card className="bg-[#36302b] border-stone-800">
      <CardHeader className="pb-2">
        <h3 className="font-display text-stone-100 text-base">Marketplace Stats</h3>
      </CardHeader>
      <CardContent className="space-y-1">
        {STATS.map(({ label, value, icon }) => (
          <div
            key={label}
            className="flex items-center justify-between py-2.5 border-b border-stone-800 last:border-0"
          >
            <span className="font-sans text-xs text-stone-500">{label}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-semibold text-stone-200 text-sm">{value}</span>
              {icon}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── RelatedProducts ───────────────────────────────────────────────────────────

export function RelatedProducts({ products, title, compact = false }) {
  return (
    <Card className="bg-[#36302b] border-stone-800">
      <CardHeader className="pb-2">
        <h3 className="font-display text-stone-100 text-base">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {products.map((product) =>
            compact
              ? <CompactProductCard key={product.id} product={product} />
              : <FullProductCard key={product.id} product={product} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CompactProductCard({ product }) {
  return (
    <Link
      href={`/mockups/direction-2-marketplace/product/${product.id}`}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-800/60 transition-colors group"
    >
      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-stone-800 border border-stone-700">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-sm text-stone-200 truncate group-hover:text-amber-400 transition-colors">
          {product.name}
        </p>
        <p className="font-sans text-xs text-stone-500 truncate">{product.tagline}</p>
      </div>
      <span className="font-display text-sm text-amber-400 shrink-0">₹{product.price}</span>
    </Link>
  );
}

function FullProductCard({ product }) {
  return (
    <Link
      href={`/mockups/direction-2-marketplace/product/${product.id}`}
      className="group block"
    >
      <div className="flex gap-4 p-4 rounded-xl border border-stone-800 hover:border-amber-500/40 transition-colors">
        <div className="relative w-[72px] h-[72px] shrink-0 rounded-lg overflow-hidden bg-stone-800 border border-stone-700">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans font-medium text-stone-200 text-sm truncate group-hover:text-amber-400 transition-colors">
            {product.name}
          </p>
          <p className="font-sans text-xs text-stone-500 truncate mt-0.5">{product.tagline}</p>
          <p className="font-display text-amber-400 text-sm mt-1.5">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
}