import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Star } from "lucide-react";
import { useState } from "react";

export function ProductHeader({ product }) {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="border-rose-200/50 bg-rose-50/50 text-rose-700 backdrop-blur-sm"
          >
            {product.type}
          </Badge>
          {product.in_stock ? (
            <Badge
              variant="outline"
              className="border-emerald-200/50 bg-emerald-50/50 text-emerald-700 backdrop-blur-sm"
            >
              In Stock
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-amber-200/50 bg-amber-50/50 text-amber-700 backdrop-blur-sm"
            >
              Low Stock
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
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
            <Heart className={`h-4 w-4 ${liked ? "fill-rose-500" : ""}`} />
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

      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
        {product.name}
      </h1>
      <p className="text-lg lg:text-xl text-gray-600">{product.tagline}</p>

      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 lg:h-5 lg:w-5 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">(48 reviews)</span>
      </div>
    </div>
  );
}
