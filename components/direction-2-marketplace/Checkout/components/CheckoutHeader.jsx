import { ArrowLeft, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function CheckoutHeader({ product }) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/mockups/direction-2-marketplace/product/${product.id}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 shrink-0"
            >
              <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                Back to product
              </span>
            </Link>

            <Separator
              orientation="vertical"
              className="hidden sm:block h-6"
            />

            {/* Product Info */}
            <div className="text-sm min-w-0 ">
              <span className="text-gray-500">Ordering:</span>
              <span className="font-medium truncate block">
                {product.name}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-right">
            <Badge
              variant="outline"
              className="gap-1 justify-center sm:justify-start"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">
                Secure Checkout
              </span>
              <span className="sm:hidden">Secure</span>
            </Badge>

            <div className="text-xs sm:text-sm text-gray-500">
              Step 2 of 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
