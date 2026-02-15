import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function RelatedProducts({ products, title, compact = false }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">{title}</h3>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compact={compact}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProductCard({ product, compact }) {
  const imageSize = compact ? 48 : 72;

  if (compact) {
    return (
      <Link
        href={`/mockups/direction-2-marketplace/product/${product.id}`}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {/* Image */}
        <div
          className="relative shrink-0 rounded-md overflow-hidden bg-gray-100"
          style={{ width: imageSize, height: imageSize }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {product.name}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {product.tagline}
          </p>
        </div>

        <span className="font-bold text-sm shrink-0">
          ₹{product.price}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/mockups/direction-2-marketplace/product/${product.id}`}
      className="group block"
    >
      <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
        <div className="flex gap-4">
          {/* Image */}
          <div
            className="relative shrink-0 rounded-lg overflow-hidden bg-gray-100"
            style={{ width: imageSize, height: imageSize }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate group-hover:text-blue-600">
              {product.name}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {product.tagline}
            </p>
            <p className="font-bold mt-1">
              ₹{product.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
