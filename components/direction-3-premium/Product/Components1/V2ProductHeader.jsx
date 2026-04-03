import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  Star,
  Eye,
  TrendingUp,
  Package,
  Download,
  Clock,
} from "lucide-react";
import { useState } from "react";

const MOCK_STATS = {
  rating: 4.8,
  reviews: 142,
  sales: 1247,
  downloads: 2891,
  views: "1.2k",
};

export function V2ProductHeader({ product }) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.tagline,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-7">
          {/* Image + thumbnails */}
          <div className="md:w-[42%] shrink-0">
            <div className="group relative aspect-square rounded-xl overflow-hidden bg-stone-50 border border-stone-200/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.12)]">
              {" "}
              <Image
                src={product?.product_images?.[0]?.image_url || null}
                alt={product?.product_images?.[0]?.alt_text || product?.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && (
                <Badge className="absolute top-3 left-3 bg-rose-500 text-white border-0 font-sans text-[10px] px-2 transition-all duration-300 group-hover:bg-black group-hover:scale-105">
                  -{discount}%
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-stone-100 border border-stone-200/60 cursor-pointer hover:border-rose-300 transition-colors"
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            {/* Type badge + actions */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge
                  variant="outline"
                  className="mb-2.5 border-rose-200 bg-rose-50/50 text-rose-700 font-sans text-[10px] tracking-widest uppercase"
                >
                  {product.type}
                </Badge>
                <h1 className="font-display text-2xl sm:text-3xl text-stone-900 leading-tight">
                  {product.name}
                </h1>
                <p className="font-sans text-sm text-stone-500 mt-1.5 leading-relaxed">
                  {product.tagline}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleLike}
                  className={`h-8 w-8 rounded-full transition-all ${
                    liked
                      ? "text-rose-500 bg-rose-50"
                      : "text-stone-400 hover:text-rose-500 hover:bg-rose-50"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${liked ? "fill-rose-500" : ""}`}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleShare}
                  className="h-8 w-8 rounded-full text-stone-400 hover:text-blue-500 hover:bg-blue-50"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Rating + stat row */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(MOCK_STATS.rating) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-stone-800">
                  {MOCK_STATS.rating}
                </span>
                <span className="text-stone-400">({MOCK_STATS.reviews})</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1 text-stone-500">
                <Eye className="w-3.5 h-3.5" />
                <span>{MOCK_STATS.views} views</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{MOCK_STATS.sales} sales</span>
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-display text-4xl text-stone-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="font-sans text-lg text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <Badge className="bg-rose-50 text-rose-600 border border-rose-200 font-sans text-xs">
                    Save ₹
                    {(product.originalPrice - product.price).toLocaleString()}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-stone-500 font-sans">
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  {product.details?.format}
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  {MOCK_STATS.downloads} downloads
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Updated 2 days ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
