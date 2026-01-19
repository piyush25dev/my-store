import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Eye, TrendingUp, Package, Download, Clock, Heart } from "lucide-react";

export default function ProductHeader({ product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const stats = {
    rating: 4.8,
    reviews: 142,
    sales: 1247,
    downloads: 2891,
    views: "1.2k",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Gallery */}
          <div className="md:w-1/3">
            <div className="relative aspect-square rounded-lg overflow-hidden border">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <Badge className="absolute top-3 left-3 bg-red-500 px-3 py-1">
                  {discount}% OFF
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded border cursor-pointer" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-2/3 space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {product.type}
                  </Badge>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  <p className="text-gray-600 mt-1">{product.tagline}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>

              {/* Ratings & Stats */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4">
                <RatingDisplay rating={stats.rating} reviews={stats.reviews} />
                <StatItem icon={<Eye className="w-4 h-4" />} text={`${stats.views} views today`} />
                <StatItem 
                  icon={<TrendingUp className="w-4 h-4" />} 
                  text={`${stats.sales} sales`} 
                  variant="success"
                />
              </div>
            </div>

            {/* Price Section */}
            <PriceDisplay 
              price={product.price} 
              originalPrice={product.originalPrice} 
              discount={discount}
              details={product.details}
              stats={stats}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper Components
function RatingDisplay({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="font-semibold">{rating}</span>
      <span className="text-gray-500">({reviews} reviews)</span>
    </div>
  );
}

function StatItem({ icon, text, variant = "default" }) {
  const variantClasses = {
    default: "text-gray-500",
    success: "text-green-600",
  };

  return (
    <div className={`flex items-center gap-1 ${variantClasses[variant]}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function PriceDisplay({ price, originalPrice, discount, details, stats }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">₹{price}</span>
        {originalPrice && (
          <span className="text-lg text-gray-500 line-through">
            ₹{originalPrice}
          </span>
        )}
        {discount > 0 && (
          <Badge variant="secondary" className="text-sm">
            {discount}% OFF
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <StatItem icon={<Package className="w-4 h-4" />} text={details.format} />
        <StatItem icon={<Download className="w-4 h-4" />} text={`${stats.downloads} downloads`} />
        <StatItem icon={<Clock className="w-4 h-4" />} text="Updated 2 days ago" />
      </div>
    </div>
  );
}