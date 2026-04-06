import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function V2RelatedProducts({ products }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-stone-900">
          You Might Also Like
        </h2>
        <p className="font-sans text-sm text-stone-400 mt-1">
          Handpicked from the same collection
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product?.slug}`}
            className="group block bg-white rounded-xl border border-stone-200/60 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
              <Image
                src={product?.product_images?.[0]?.image_url || null} 
                alt={product?.product_images?.[0]?.alt_text || product?.name} 
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <Badge className="font-sans text-[9px] px-1.5 py-0.5 bg-white/90 text-stone-700 border border-stone-200/60 shadow-sm transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  {product.type}
                </Badge>
              </div>
            </div>
            <div className="p-3">
              <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-0.5">
                {product.material}
              </p>
              <p className="font-sans font-semibold text-stone-800 text-xs leading-snug line-clamp-2 group-hover:text-rose-700 transition-colors">
                {product.name}
              </p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="font-display text-sm text-stone-900">
                  ₹{(product.price / 100).toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="font-sans text-[10px] text-stone-400 line-through">
                    ₹{(product.originalPrice / 100).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
