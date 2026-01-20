import { Shield, Lock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SecurityBadge } from "./security-badge";

export function OrderSummary({ product, onSubmit, loading }) {
  const totalAmount = (product.price * 1.18).toFixed(2);
  const taxAmount = (product.price * 0.18).toFixed(2);

  return (
    <Card className="border border-gray-200/50 bg-white/50 backdrop-blur-sm sticky top-8">
      <CardHeader className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">
          Order Summary
        </h2>
        <p className="text-sm text-gray-600">Review your purchase</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Info */}
        <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50/30 to-white/30">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="h-12 w-12 rounded bg-gradient-to-r from-rose-400 to-pink-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">{product.tagline}</p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline" className="text-xs">
                {product.type}
              </Badge>
              <span className="font-semibold text-gray-900">
                ₹{product.price}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200/50" />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{product.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-emerald-600">Free</span>
          </div>
          {product.originalPrice && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="text-rose-600">
                -₹{product.originalPrice - product.price}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (18% GST)</span>
            <span>₹{taxAmount}</span>
          </div>
        </div>

        <Separator className="bg-gray-200/50" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">Total Amount</p>
            <p className="text-sm text-gray-600">Including taxes</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ₹{totalAmount}
            </p>
            <p className="text-xs text-gray-600">
              ₹{product.price} + 18% GST
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-gray-400" />
            <span>Secure 256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Lock className="h-4 w-4 text-gray-400" />
            <span>Your payment details are safe</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-gray-400" />
            <span>Instant access after payment</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </span>
          ) : (
            `Pay ₹${totalAmount}`
          )}
        </Button>
      </CardFooter>
      <SecurityBadge/>
    </Card>
  );
}