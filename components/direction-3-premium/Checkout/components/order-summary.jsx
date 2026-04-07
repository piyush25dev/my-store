import { Shield, Lock, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SecurityBadge } from "./security-badge";
import Image from "next/image";

export function OrderSummary({
  items = [],
  subtotal = 0,
  tax = 0,
  shipping = 0,
  total = 0,
  onSubmit,
  loading = false,
}) {
  return (
    <Card className="border border-gray-200/50 bg-white/50 backdrop-blur-sm sticky top-8">
      <CardHeader className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
        <p className="text-sm text-gray-600">Review your purchase</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Items List */}
        {items.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => {
              const product = item.products;
              const image =
                product?.product_images?.find((img) => img.is_primary) ||
                product?.product_images?.[0];

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-gray-50/50 border border-gray-200/30"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {image?.image_url && (
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={image.image_url}
                          alt={product?.name || "Product"}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product?.name || item.product_name}
                      </p>
                      {item.variant_label && (
                        <p className="text-xs text-gray-500">
                          {item.variant_label}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{((item.unit_price / 100 || 0) * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{(item.unit_price / 100 || 0).toLocaleString()} ea
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Separator className="bg-gray-200/50" />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            {shipping === 0 ? (
              <span className="text-emerald-600 font-medium">Free</span>
            ) : (
              <span className="text-gray-900 font-medium">₹{shipping.toLocaleString()}</span>
            )}
          </div>

          {shipping > 0 && (
            <p className="text-xs text-gray-500 bg-blue-50/50 rounded-lg px-3 py-2">
              Add ₹{(499 - subtotal).toLocaleString()} more for free shipping
            </p>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (18% GST)</span>
            <span className="text-gray-900 font-medium">₹{tax.toLocaleString()}</span>
          </div>
        </div>

        <Separator className="bg-gray-200/50" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">Total Amount</p>
            <p className="text-sm text-gray-600">Including taxes & shipping</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>Secure 256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>Your payment details are safe</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>Instant access after payment</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-6 flex flex-col gap-3">
        <Button
          size="lg"
          type="submit"
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 text-base"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </span>
          ) : (
            `Pay ₹${total.toLocaleString()}`
          )}
        </Button>
        <p className="text-xs text-center text-gray-500">
          You will not be charged until you review this order on the next page
        </p>
      </CardFooter>

      <SecurityBadge />
    </Card>
  );
}