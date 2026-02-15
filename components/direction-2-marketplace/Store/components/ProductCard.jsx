"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartIcon, HeartIcon } from "./Icons";
import StarRating from "./Starrating";
import { cn, getDiscount } from "@/lib/utils";

export default function ProductCard({ product, onAddToCart, onWishlist, isWishlisted }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const discount = getDiscount(product.price, product.originalPrice);

  return (
    // relative so wishlist button can be absolutely positioned inside the card
    <Card className="relative group overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-lg">

      {/* ── Image ──────────────────────────────────────────────────────────── */}
      <Link href={`/mockups/direction-2-marketplace/product/${product.id}`} className="block">
        {/*
          aspect-[4/5] on mobile  → compact, fits 2-col grid cleanly
          aspect-[3/4] on sm+     → original taller ratio
        */}
        <div className="relative overflow-hidden bg-stone-100 aspect-[4/5] sm:aspect-[3/4]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
            {product.badge && (
              <Badge className="text-[9px] sm:text-[10px] px-1.5 py-0.5 tracking-wide leading-none">
                {product.badge}
              </Badge>
            )}
            {discount && (
              <Badge variant="destructive" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 leading-none w-fit">
                -{discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 leading-none">
                Sold Out
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* ── Wishlist — absolute inside Card (not inside Link) ─────────────── */}
      <button
        onClick={() => onWishlist(product.id)}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "absolute top-2 right-2 sm:top-3 sm:right-3 z-10",
          "w-7 h-7 sm:w-8 sm:h-8 rounded-full",
          "flex items-center justify-center shadow-sm",
          "transition-all duration-200",
          isWishlisted
            ? "bg-red-50 text-red-500"
            : "bg-white/90 text-stone-400 hover:bg-white hover:text-red-400"
        )}
      >
        <HeartIcon filled={isWishlisted} />
      </button>

      {/* ── Details ────────────────────────────────────────────────────────── */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 gap-2 sm:gap-3">

        {/* Material + Name */}
        <Link
          href={`/mockups/direction-2-marketplace/product/${product.id}`}
          className="block space-y-0.5"
        >
          <p className="text-[8px] sm:text-[11px] uppercase tracking-widest text-stone-400 font-medium leading-none">
            {product.material}
          </p>
          <h3 className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug line-clamp-2 group-hover:text-stone-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Color swatches — desktop only, saves space on mobile */}
        <div className="hidden sm:flex items-center gap-1.5">
          {product.colors.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.preventDefault();
                setSelectedColor(c);
              }}
              aria-label={`Select colour ${c}`}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                selectedColor === c ? "border-stone-900 scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 sm:gap-2">
          <StarRating rating={product.rating} />
          <span className="text-[10px] sm:text-[11px] text-stone-400 leading-none">
            ({product.reviews})
          </span>
        </div>

        {/* Price — pushed to bottom */}
        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-sm sm:text-base font-bold text-stone-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-stone-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (product.inStock) onAddToCart(product);
          }}
          disabled={!product.inStock}
          size="sm"
          variant={product.inStock ? "default" : "outline"}
          className="w-full h-8 sm:h-9 text-[11px] sm:text-xs mt-0.5"
        >
          {product.inStock ? (
            <>
              <span className="hidden sm:inline mr-1.5"><CartIcon /></span>
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add to Cart</span>
            </>
          ) : (
            "Out of Stock"
          )}
        </Button>
      </div>
    </Card>
  );
}