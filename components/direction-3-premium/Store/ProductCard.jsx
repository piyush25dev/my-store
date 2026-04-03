// components/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/lib/hooks/useWishlist";

export function ProductCard({ product, getProductLink }) {
  return (
    <Card className="group overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <CardHeader className="p-0">
        <ProductCardImage product={product} />
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <ProductCardInfo product={product} />
        <ProductCardPrice product={product} />
      </CardContent>

      <CardFooter className="p-6">
        <ProductCardActions product={product} getProductLink={getProductLink} />
      </CardFooter>
    </Card>
  );
}

function ProductCardImage({ product }) {
  const { wishlist, add, remove, isInWishlist } = useWishlist();
  const [saving, setSaving] = useState(false);

  const saved = isInWishlist(product.id);
  const wishlistEntry = wishlist.find(
    (item) => String(item.product_id) === String(product.id)
  );

  async function handleWishlistToggle(e) {
    e.preventDefault(); // prevent card link navigation
    e.stopPropagation();
    setSaving(true);
    try {
      if (saved && wishlistEntry) {
        await remove(wishlistEntry.id);
      } else {
        await add(product.id);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Top badges */}
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <Badge className="w-fit border-0 bg-white/90 !text-black group-hover:!text-white group-hover:!bg-black transition-colors duration-300 shadow-sm">
          {product.type}
        </Badge>
        {!product.in_stock && (
          <Badge variant="destructive" className="w-fit">
            Sold Out
          </Badge>
        )}
      </div>

      {/* Heart button — visible on hover, stays visible when saved */}
      <div
        className={`absolute right-4 top-4 transition-all duration-300 ${
          saved ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={handleWishlistToggle}
          disabled={saving}
          className={`h-8 w-8 rounded-full transition-all ${
            saved
              ? "text-rose-500 bg-rose-50"
              : "text-stone-400 bg-white hover:text-rose-500 hover:bg-rose-50"
          }`}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 ${saved ? "fill-rose-500" : ""}`} />
          )}
        </Button>
      </div>
    </div>
  );
}

function ProductCardInfo({ product }) {
  return (
    <div>
      <h4 className="mb-1 text-lg font-semibold text-gray-900">{product.name}</h4>
      <p className="text-sm text-gray-600">{product.tagline}</p>
    </div>
  );
}

function ProductCardPrice({ product }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
        {product.originalPrice && (
          <span className="ml-2 text-sm text-gray-400 line-through">
            ₹{product.originalPrice}
          </span>
        )}
      </div>
    </div>
  );
}

function ProductCardActions({ product, getProductLink }) {
  if (product.in_stock) {
    return (
      <div className="flex w-full items-center justify-between">
        <Link href={getProductLink(product.id)} className="flex-1">
          <Button
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          >
            View Details
          </Button>
        </Link>
        <Button size="icon" variant="ghost" className="ml-2 h-10 w-10">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button disabled className="w-full bg-gray-100 text-gray-500 hover:bg-gray-100">
      Currently Unavailable
    </Button>
  );
}