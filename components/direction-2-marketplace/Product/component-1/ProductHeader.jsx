import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Eye, TrendingUp, Package, Download, Clock, Heart } from "lucide-react";

const STATS = {
  rating: 4.8,
  reviews: 142,
  sales: 1247,
  downloads: 2891,
  views: "1.2k",
};

export default function ProductHeader({ product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="overflow-hidden bg-white border-stone-200/60 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 pt-2">

          {/* Image Gallery */}
          <div className="md:w-1/3">
            <div className="relative aspect-square rounded-xl overflow-hidden border border-stone-200/60 bg-stone-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
              {discount > 0 && (
                <Badge className="absolute top-3 left-3 bg-rose-500 text-white border-0 font-sans text-[10px] px-2.5 py-1">
                  {discount}% OFF
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

          {/* Product Info */}
          <div className="md:w-2/3 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-2.5 border-rose-200 bg-rose-50/60 text-rose-700 font-sans text-[10px] tracking-widest uppercase"
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
                <button className="p-2 rounded-lg hover:bg-rose-50 transition-colors text-stone-400 hover:text-rose-500 shrink-0">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Ratings & Stats Row */}
              <div className="flex flex-wrap items-center gap-4 mt-5">
                <RatingDisplay rating={STATS.rating} reviews={STATS.reviews} />
                <Divider />
                <StatItem icon={<Eye className="w-3.5 h-3.5" />} text={`${STATS.views} views today`} />
                <Divider />
                <StatItem icon={<TrendingUp className="w-3.5 h-3.5" />} text={`${STATS.sales} sales`} variant="success" />
              </div>
            </div>

            {/* Price Section */}
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discount={discount}
              details={product.details}
              stats={STATS}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Divider() {
  return <span className="text-stone-300">|</span>;
}

function RatingDisplay({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"
            }`}
          />
        ))}
      </div>
      <span className="font-sans font-semibold text-sm text-stone-800">{rating}</span>
      <span className="font-sans text-xs text-stone-400">({reviews} reviews)</span>
    </div>
  );
}

function StatItem({ icon, text, variant = "default" }) {
  const color = variant === "success" ? "text-emerald-600" : "text-stone-400";
  return (
    <div className={`flex items-center gap-1.5 font-sans text-xs ${color}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function PriceDisplay({ price, originalPrice, discount, details, stats }) {
  return (
    <div className="pt-4 border-t border-stone-100 space-y-3">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl text-stone-900">₹{price.toLocaleString()}</span>
        {originalPrice && (
          <span className="font-sans text-base text-stone-400 line-through">
            ₹{originalPrice.toLocaleString()}
          </span>
        )}
        {discount > 0 && (
          <Badge className="bg-rose-50 text-rose-600 border border-rose-200 font-sans text-xs">
            {discount}% OFF
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <StatItem icon={<Package className="w-3.5 h-3.5" />} text={details?.format} />
        <StatItem icon={<Download className="w-3.5 h-3.5" />} text={`${stats.downloads} downloads`} />
        <StatItem icon={<Clock className="w-3.5 h-3.5" />} text="Updated 2 days ago" />
      </div>
    </div>
  );
}