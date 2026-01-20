import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProductActions({ product }) {
  return (
    <div className="space-y-4">
      {product.inStock ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Primary */}
            <Button
              size="lg"
              className="h-14 w-full text-base sm:text-lg font-semibold
                         bg-gradient-to-r from-gray-900 to-gray-800
                         hover:from-gray-800 hover:to-gray-700
                         shadow-md hover:shadow-lg transition"
            >
              Add to cart · ₹{product.price}
            </Button>

            {/* Buy Now → Checkout */}
            <Link
              href={`/mockups/direction-3-premium/checkout?product=${product.id}`}
            >
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full text-base sm:text-lg font-semibold
                           border-2 hover:border-gray-900
                           hover:bg-gray-50/70 transition"
              >
                Buy now
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Secure checkout · Instant access
          </p>
        </>
      ) : (
        <Button
          size="lg"
          disabled
          className="h-14 w-full text-base sm:text-lg font-semibold
                     bg-gray-100 text-gray-500"
        >
          Out of stock — Notify me
        </Button>
      )}
    </div>
  );
}
