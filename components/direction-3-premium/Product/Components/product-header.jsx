import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Star } from "lucide-react";

export function ProductHeader({ product }) {
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
          {product.inStock ? (
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
            className="h-9 w-9 rounded-full hover:bg-rose-50/50 hover:text-rose-600"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-9 w-9 rounded-full hover:bg-blue-50/50 hover:text-blue-600"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
        {product.name}
      </h1>
      <p className="text-lg lg:text-xl text-gray-600">
        {product.tagline}
      </p>

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