"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Shield, Download, RotateCcw, Users, Clock } from "lucide-react";
import Link from "next/link";

const ADDON_OPTIONS = [
  { id: "support", label: "Extended Support", description: "+6 months support", price: 299 },
  { id: "tutorials", label: "Video Tutorials", description: "+5 tutorial videos", price: 499 },
];

const TRUST_BADGES = [
  { icon: <Shield className="w-5 h-5" />, label: "Secure Payment" },
  { icon: <Download className="w-5 h-5" />, label: "Instant Download" },
  { icon: <RotateCcw className="w-5 h-5" />, label: "30-Day Returns" },
  { icon: <Users className="w-5 h-5" />, label: "Support 24/7" },
];

export default function PurchaseCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id);
  const [addons, setAddons] = useState({ support: false, tutorials: false });

  const toggleAddon = (id) => setAddons((prev) => ({ ...prev, [id]: !prev[id] }));

  const total =
    product.price +
    (addons.support ? 299 : 0) +
    (addons.tutorials ? 499 : 0);

  return (
    <Card className="sticky top-24 bg-[#12110f] border-stone-800">
      <CardHeader className="pb-2">
        <h3 className="font-display text-stone-100 text-base">Purchase Options</h3>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}

        {/* Add-ons */}
        <AddonSelector addons={addons} onToggle={toggleAddon} />

        {/* Stock Status */}
        <StockStatus inStock={product.inStock} />

        {/* Total & Actions */}
        <div className="space-y-3 pt-4 border-t border-stone-800">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-stone-400">Total</span>
            <span className="font-display text-2xl text-amber-400">₹{total.toLocaleString()}</span>
          </div>

          <Button
            size="lg"
            disabled={!product.inStock}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white-900 font-sans font-semibold gap-2 disabled:opacity-40"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart · ₹{total.toLocaleString()}
          </Button>

          {product.inStock ? (
            <Link href={`/mockups/direction-2-marketplace/checkout?product=${product.id}`} className="block">
              <Button
                size="lg"
                variant="outline"
                className="w-full font-sans border-stone-700 text-black-300 hover:border-amber-500/60 hover:text-amber-400 hover:bg-transparent"
              >
                Buy Now
              </Button>
            </Link>
          ) : (
            <Button size="lg" variant="outline" disabled
              className="w-full font-sans border-stone-800 text-stone-600 opacity-50 cursor-not-allowed"
            >
              Out of Stock
            </Button>
          )}
        </div>

        {/* Trust Badges */}
        <TrustBadges />
      </CardContent>
    </Card>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function VariantSelector({ variants, selected, onSelect }) {
  return (
    <div className="space-y-2.5">
      <p className="font-sans text-xs font-semibold text-stone-300 uppercase tracking-widest">
        Select Version
      </p>
      <div className="space-y-2">
        {variants.map((variant) => (
          <label
            key={variant.id}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              selected === variant.id
                ? "border-amber-500/60 bg-amber-500/5"
                : "border-stone-800 hover:border-stone-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="variant"
                checked={selected === variant.id}
                onChange={() => onSelect(variant.id)}
                className="accent-amber-500"
              />
              <div>
                <p className="font-sans font-medium text-stone-200 text-sm">{variant.label}</p>
                <p className="font-sans text-xs text-stone-500">Most popular</p>
              </div>
            </div>
            <span className="font-display text-amber-400 text-sm">₹1,299</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AddonSelector({ addons, onToggle }) {
  return (
    <div className="space-y-2.5">
      <p className="font-sans text-xs font-semibold text-stone-300 uppercase tracking-widest">
        Add-ons
      </p>
      <div className="space-y-2">
        {ADDON_OPTIONS.map((addon) => (
          <label
            key={addon.id}
            className="flex items-center justify-between p-3 rounded-xl border border-stone-800 cursor-pointer hover:border-stone-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={addons[addon.id]}
                onChange={() => onToggle(addon.id)}
                className="rounded accent-amber-500"
              />
              <div>
                <p className="font-sans font-medium text-stone-200 text-sm">{addon.label}</p>
                <p className="font-sans text-xs text-stone-500">{addon.description}</p>
              </div>
            </div>
            <span className="font-sans text-xs text-stone-400 font-semibold">+₹{addon.price}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StockStatus({ inStock }) {
  if (!inStock) {
    return (
      <Alert className="bg-red-950/40 border-red-900/50">
        <AlertDescription className="flex items-center gap-2 font-sans text-sm text-red-400">
          <Clock className="w-4 h-4" />
          Restocking soon — Join waitlist
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="bg-emerald-950/30 border border-emerald-900/30 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-xs font-semibold text-emerald-400">In Stock</span>
        <span className="font-sans text-xs text-stone-500">Only 12 left</span>
      </div>
      <Progress value={30} className="h-1 bg-stone-800 [&>div]:bg-emerald-500" />
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-stone-800">
      {TRUST_BADGES.map(({ icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-stone-900/50 border border-stone-800"
        >
          <span className="text-stone-200">{icon}</span>
          <p className="font-sans text-[11px] text-stone-200">{label}</p>
        </div>
      ))}
    </div>
  );
}