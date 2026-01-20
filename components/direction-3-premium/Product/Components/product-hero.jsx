import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function ProductHero({ product }) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-2xl shadow-gray-100/50 bg-gradient-to-br from-gray-50/50 to-white">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
            
            <div className="absolute left-6 top-6 z-10">
              <Badge className="gap-1.5 bg-gradient-to-r from-rose-500/90 to-pink-500/90 backdrop-blur-sm border-0 text-white">
                <Star className="h-3 w-3" />
                Premium
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="aspect-square rounded-xl bg-gradient-to-br from-gray-100/50 to-gray-200/50 border border-gray-200/50 hover:border-gray-300 transition-all cursor-pointer backdrop-blur-sm"
          />
        ))}
      </div>
    </div>
  );
}