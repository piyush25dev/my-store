import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ProductHero({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product?.product_images || [];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-0 shadow-2xl shadow-gray-100/50 bg-gradient-to-br from-gray-50/50 to-white">
        <CardContent className="!p-0">
          <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-xl">
            <Image
              src={images[selectedImage]?.image_url || images[0]?.image_url || null}
              alt={images[selectedImage]?.alt_text || product?.name}
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

            {/* Navigation arrows for multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Image counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnails - Responsive grid layout */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedImage === index
                  ? "ring-2 ring-rose-500 ring-offset-2 shadow-lg"
                  : "hover:scale-105"
              }`}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || `${product?.name} thumbnail ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
              {selectedImage === index && (
                <div className="absolute inset-0 bg-rose-500/10 border-2 border-rose-500 rounded-xl" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}