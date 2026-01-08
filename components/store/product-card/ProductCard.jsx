import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }) {
  const isPhysical = product.type === "Physical";
  
  return (
    <Card className="group overflow-hidden rounded-3xl border-2 border-slate-200 bg-white transition-all duration-300 hover:border-purple-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Image with gradient overlay */}
      <div className="relative h-52 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-400 font-semibold text-sm">
            {product.name}
          </div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Title + type badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <Badge 
            className={`shrink-0 font-semibold ${
              isPhysical 
                ? 'bg-orange-100 text-orange-700 border-orange-200' 
                : 'bg-purple-100 text-purple-700 border-purple-200'
            } border`}
          >
            {product.type}
          </Badge>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {product.price}
          </span>
          <Button 
            size="sm" 
            className="rounded-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}