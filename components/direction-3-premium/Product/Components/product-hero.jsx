import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function ProductHero({ product }) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-2xl shadow-gray-100/50 bg-gradient-to-br from-gray-50/50 to-white">
        <CardContent className="!p-0">
          <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-xl">
            <Image
              src={product?.product_images?.[0]?.image_url || null}
              alt={product?.product_images?.[0]?.alt_text || product?.name}
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

      {/* Thumbnails in a single horizontal line */}
      {product?.product_images?.length > 1 && (
        <div className="flex gap-3">
          {product.product_images.slice(1).map((image, index) => {
            const totalThumbnails = product.product_images.slice(1).length;
            
            // Calculate width based on number of thumbnails
            let widthClass = 'flex-1';
            if (totalThumbnails === 1) {
              widthClass = 'w-full';
            } else if (totalThumbnails === 2) {
              widthClass = 'w-1/2';
            } else if (totalThumbnails === 3) {
              widthClass = 'w-1/3';
            } else {
              widthClass = 'w-1/4';
            }
            
            return (
              <div
                key={image.id || index}
                className={`relative aspect-square ${widthClass} rounded-xl bg-gradient-to-br from-gray-100/50 to-gray-200/50 border border-gray-200/50 hover:border-gray-300 transition-all cursor-pointer backdrop-blur-sm overflow-hidden group`}
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `${product?.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes={`(max-width: 768px) ${100/totalThumbnails}vw, ${100/totalThumbnails}vw`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}