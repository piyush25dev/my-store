import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

export function FeaturedProduct({ product, getProductLink }) {
  if (!product) return null;

  return (
    <div className="mb-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-rose-400 to-amber-400"></div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Featured Product
          </h2>
        </div>
        <Badge className="gap-1.5 bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-1.5">
          <Star className="h-3 w-3" />
          Premium Pick
        </Badge>
      </div>

      <Card className="overflow-hidden border-0 bg-gradient-to-r from-white to-gray-50/50 shadow-xl shadow-gray-100/50">
        <CardContent className="p-0">
          <div className="grid gap-8 md:grid-cols-2">
            <ProductImage product={product} />
            <ProductDetails product={product} getProductLink={getProductLink} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductImage({ product }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-50/50 to-amber-50/50 p-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
    </div>
  );
}

function ProductDetails({ product, getProductLink }) {
  return (
    <div className="flex flex-col justify-start p-0 h-full">
  <div className="mb-4 space-y-3">
    <div className="flex items-center gap-3">
      <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
        {product.type}
      </Badge>

      {product.in_stock ? (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          In Stock
        </Badge>
      ) : (
        <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
          Sold Out
        </Badge>
      )}
    </div>

    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
      {product.name}
    </h3>

    <p className="text-base md:text-lg text-gray-600">
      {product.tagline}
    </p>
  </div>

  <PriceSection product={product} />

  <div className="flex flex-col gap-3 sm:flex-row mt-4">
    <Link href={getProductLink(product.id)} className="flex-1">
      <Button 
        size="lg" 
        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        View Product Details
      </Button>
    </Link>

    <Button 
      size="lg" 
      variant="outline" 
      className="border-gray-300 hover:bg-gray-50"
    >
      <Heart className="mr-2 h-5 w-5" />
      Save
    </Button>
  </div>
</div>
  );
}

function PriceSection({ product }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <span className="text-4xl font-bold text-gray-900">
          ₹{product.price}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
            <Badge className="bg-gradient-to-r from-rose-500 to-amber-500">
              Save ₹{product.originalPrice - product.price}
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}