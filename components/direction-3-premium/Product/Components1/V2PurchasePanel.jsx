"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Shield, Download, RotateCcw, Users, Clock, Zap } from "lucide-react";

const ADDON_OPTIONS = [
  { id: "support", label: "Extended Support", description: "+6 months", price: 299 },
  { id: "tutorials", label: "Video Tutorials", description: "+5 videos", price: 499 },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Secure Payment" },
  { icon: Download, label: "Instant Access" },
  { icon: RotateCcw, label: "30-Day Returns" },
  { icon: Users, label: "24/7 Support" },
];

export function V2PurchasePanel({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.id);
  const [addons, setAddons] = useState({ support: false, tutorials: false });

  const toggleAddon = (id) => setAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  const total = product.price + (addons.support ? 299 : 0) + (addons.tutorials ? 499 : 0);

  return (
    <div className="sticky top-24 bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
      {/* Header band */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-5 py-4">
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

      <div className="p-5 space-y-5">
        {/* Variant selector */}
        {product.variants?.length > 1 && (
          <div className="space-y-2.5">
            <p className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest">Version</p>
            <div className="space-y-2">
              {product.variants.map((v) => (
                <label
                  key={v.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedVariant === v.id
                      ? "border-stone-900 bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="variant"
                      checked={selectedVariant === v.id}
                      onChange={() => setSelectedVariant(v.id)}
                      className="accent-stone-900"
                    />
                    <span className="font-sans font-medium text-stone-800 text-sm">{v.label}</span>
                  </div>
                  <span className="font-sans text-xs text-stone-500">₹{product.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        <div className="space-y-2.5">
          <p className="font-sans text-xs font-semibold text-stone-500 uppercase tracking-widest">Add-ons</p>
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
                    onChange={() => toggleAddon(addon.id)}
                    className="rounded accent-stone-900"
                  />
                  <div>
                    <p className="font-sans font-medium text-stone-800 text-sm">{addon.label}</p>
                    <p className="font-sans text-xs text-stone-400">{addon.description}</p>
                  </div>
                </div>
                <span className="font-sans text-xs text-stone-500">+₹{addon.price}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stock */}
        {product.inStock ? (
          <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-xs font-semibold text-emerald-700">In Stock</span>
              <span className="font-sans text-xs text-stone-400">Only 12 left</span>
            </div>
            <Progress value={30} className="h-1 bg-emerald-100 [&>div]:bg-emerald-500" />
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-sans text-xs text-amber-700">Restocking soon — join waitlist</span>
          </div>
        )}

        {/* CTA */}
        <div className="space-y-2.5 pt-1 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-stone-400">Total</span>
            <span className="font-display text-xl text-stone-900">₹{total.toLocaleString()}</span>
          </div>

          <Button
            size="lg"
            disabled={!product.inStock}
            className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-sans font-semibold gap-2 disabled:opacity-40"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>

          {product.inStock ? (
            <Link href={`/checkout?product=${product.id}`} className="block">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12 font-sans border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-900 gap-2"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </Button>
            </Link>
          ) : (
            <Button size="lg" variant="outline" disabled className="w-full h-12 font-sans opacity-40">
              Out of Stock
            </Button>
          )}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <Icon className="w-4 h-4 text-stone-400" />
              <p className="font-sans text-[10px] text-stone-500 text-center leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}