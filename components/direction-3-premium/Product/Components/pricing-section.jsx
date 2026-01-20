import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function PricingSection({ product }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-4xl lg:text-5xl font-bold text-gray-900">
          ₹{product.price}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-xl lg:text-2xl text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
            <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
              Save ₹{product.originalPrice - product.price}
            </Badge>
          </>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {product.type === 'Physical' 
          ? '+ Shipping calculated at checkout' 
          : 'Instant digital access'
        }
      </p>
      <Separator className="bg-gray-200/50" />
    </div>
  );
}