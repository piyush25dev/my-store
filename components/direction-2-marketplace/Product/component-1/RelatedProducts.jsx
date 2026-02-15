import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function RelatedProducts({ products, title, compact = false }) {
  return (
    <Card className="bg-white border-stone-200/60 shadow-sm">
      <CardHeader className="pb-2 pt-5 px-5">
        <h3 className="font-display text-stone-900 text-base">{title}</h3>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="space-y-1">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact={compact} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProductCard({ product, compact }) {
  if (compact) {
    return (
      <Link
        href={`/mockups/direction-2-marketplace/product/${product.id}`}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors group"
      >
        <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/60">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-sans font-medium text-sm text-stone-800 truncate group-hover:text-rose-600 transition-colors">
            {product.name}
          </p>
          <p className="font-sans text-xs text-stone-400 truncate">{product.tagline}</p>
        </div>

        <span className="font-display text-sm text-stone-900 shrink-0">
          ₹{product.price.toLocaleString()}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/mockups/direction-2-marketplace/product/${product.id}`}
      className="group block"
    >
      <div className="flex gap-4 p-3 rounded-xl border border-stone-100 hover:border-rose-200/60 hover:bg-rose-50/20 transition-colors">
        <div className="relative w-[68px] h-[68px] shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/60">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-sans font-medium text-stone-800 text-sm truncate group-hover:text-rose-600 transition-colors">
            {product.name}
          </p>
          <p className="font-sans text-xs text-stone-400 truncate mt-0.5">{product.tagline}</p>
          <p className="font-display text-stone-900 text-sm mt-1.5">
            ₹{product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}