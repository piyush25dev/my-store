import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RelatedProducts({ products, currentProductId }) {
  const relatedProducts = products
    .filter(p => p.id !== currentProductId)
    .slice(0, 3);

  return (
    <div className="mt-16 lg:mt-20">
      <div className="mb-8 lg:mb-10">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
          You Might Also Like
        </h2>
        <p className="text-gray-600 mt-2">Complementary products for creators</p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {relatedProducts.map((relatedProduct) => (
          <Link 
            key={relatedProduct.id} 
            href={`/mockups/direction-3-premium/product/${relatedProduct.id}`}
            className="group block"
          >
            <Card className="overflow-hidden border border-gray-200/50 bg-white/50 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute left-4 top-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-gray-800">
                      {relatedProduct.type}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm text-gray-600">{relatedProduct.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{relatedProduct.price}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}