"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Shield, Download, RotateCcw, Users, Clock, Zap } from "lucide-react";
import Link from "next/link";

const ADDON_OPTIONS = [
  { id: "support", label: "Extended Support", description: "+6 months support", price: 299 },
  { id: "tutorials", label: "Video Tutorials", description: "+5 tutorial videos", price: 499 },
];

const TRUST_BADGES = [
  { icon: Shield,    label: "Secure Payment"  },
  { icon: Download,  label: "Instant Download" },
  { icon: RotateCcw, label: "30-Day Returns"   },
  { icon: Users,     label: "Support 24/7"     },
];

export default function PurchaseCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.id);
  const [addons, setAddons] = useState({ support: false, tutorials: false });

  const toggleAddon = (id) => setAddons((prev) => ({ ...prev, [id]: !prev[id] }));

  const total =
    product.price +
    (addons.support ? 299 : 0) +
    (addons.tutorials ? 499 : 0);

  return (
    <Card className="sticky top-24 bg-white border-stone-200/60 shadow-sm overflow-hidden">
      {/* Dark price header */}
      <div className="bg-stone-900 px-5 py-4">
        <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-1">Purchase</p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl text-white">₹{total.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="font-sans text-sm text-stone-500 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-5 space-y-5">
        {/* Variant Selection */}
        {product.variants?.length > 1 && (
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
        <div className="space-y-2.5 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-stone-400">Total</span>
            <span className="font-display text-xl text-stone-900">₹{total.toLocaleString()}</span>
          </div>

          <Button
            size="lg"
            disabled={!product.inStock}
            className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-sans font-semibold gap-2 disabled:opacity-40"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart · ₹{total.toLocaleString()}
          </Button>

          {product.inStock ? (
            <Link href={`/mockups/direction-2-marketplace/checkout?product=${product.id}`} className="block">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12 font-sans border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-900 hover:bg-transparent gap-2"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </Button>
            </Link>
          ) : (
            <Button size="lg" variant="outline" disabled
              className="w-full h-12 font-sans border-stone-200 text-stone-400 opacity-50 cursor-not-allowed"
            >
              Out of Stock
            </Button>
          )}
        </div>

        {/* Trust Badges */}
        <TrustBadgesGrid />
      </CardContent>
    </Card>
  );
}

function VariantSelector({ variants, selected, onSelect }) {
  return (
    <div className="space-y-2.5">
      <p className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest pt-2">
        Select Version
      </p>
      <div className="space-y-2">
        {variants.map((variant) => (
          <label
            key={variant.id}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              selected === variant.id
                ? "border-stone-900 bg-stone-50"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="variant"
                checked={selected === variant.id}
                onChange={() => onSelect(variant.id)}
                className="accent-stone-900"
              />
              <div>
                <p className="font-sans font-medium text-stone-800 text-sm">{variant.label}</p>
                <p className="font-sans text-xs text-stone-400">Most popular</p>
              </div>
            </div>
            <span className="font-sans text-sm text-stone-600 font-semibold">₹1,299</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AddonSelector({ addons, onToggle }) {
  return (
    <div className="space-y-2.5">
      <p className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest">
        Add-ons
      </p>
      <div className="space-y-2">
        {ADDON_OPTIONS.map((addon) => (
          <label
            key={addon.id}
            className="flex items-center justify-between p-3 rounded-xl border border-stone-200 cursor-pointer hover:border-stone-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={addons[addon.id]}
                onChange={() => onToggle(addon.id)}
                className="rounded accent-stone-900"
              />
              <div>
                <p className="font-sans font-medium text-stone-800 text-sm">{addon.label}</p>
                <p className="font-sans text-xs text-stone-400">{addon.description}</p>
              </div>
            </div>
            <span className="font-sans text-xs text-stone-500 font-semibold">+₹{addon.price}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StockStatus({ inStock }) {
  if (!inStock) {
    return (
      <Alert className="bg-amber-50 border-amber-200/60">
        <AlertDescription className="flex items-center gap-2 font-sans text-sm text-amber-700">
          <Clock className="w-4 h-4 shrink-0" />
          Restocking soon — Join waitlist
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-xs font-semibold text-emerald-700">In Stock</span>
        <span className="font-sans text-xs text-stone-400">Only 12 left</span>
      </div>
      <Progress value={30} className="h-1 bg-emerald-100 [&>div]:bg-emerald-500" />
    </div>
  );
}

function TrustBadgesGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
      {TRUST_BADGES.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
          <Icon className="w-4 h-4 text-stone-400" />
          <p className="font-sans text-[10px] text-stone-500 text-center leading-tight">{label}</p>
        </div>
      ))}
    </div>
  );
}