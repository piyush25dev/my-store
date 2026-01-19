import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Shield, Download, RotateCcw, Users, Tag } from "lucide-react";
import Image from "next/image";

export default function OrderSummary({
  product,
  formData,
  paymentMethod,
  calculateTotal,
}) {
  const subtotal = product.price;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Order Summary</h3>
          <Badge variant="outline">1 item</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Product Item */}
        <div className="space-y-4">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                {/* Title */}
                <div className="min-w-0">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <p className="text-sm text-gray-500 truncate">
                    {product.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="sm:text-right shrink-0 mt-1 sm:mt-0">
                  <div className="font-bold">₹{product.price}</div>
                  {product.originalPrice && (
                    <div className="text-sm line-through text-gray-500">
                      ₹{product.originalPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {product.type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Instant Delivery
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">GST (18%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Convenience fee</span>
            <span>₹0</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold">Total</span>
              <div className="text-xs text-gray-500">
                Inclusive of all taxes
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">₹{total}</div>
              <div className="text-sm text-gray-500">
                {product.originalPrice && (
                  <span className="text-green-600">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Have a promo code?</span>
            <Button variant="ghost" size="sm" className="gap-1">
              <Tag className="w-3 h-3" />
              Apply
            </Button>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Enter promo code" className="flex-1" />
            <Button size="sm">Apply</Button>
          </div>
        </div>

        <Separator />

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 border rounded-lg">
            <Shield className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-600">Secure Payment</p>
          </div>
          <div className="text-center p-2 border rounded-lg">
            <Download className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-600">Instant Access</p>
          </div>
          <div className="text-center p-2 border rounded-lg">
            <RotateCcw className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-600">30-Day Refund</p>
          </div>
          <div className="text-center p-2 border rounded-lg">
            <Users className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-600">24/7 Support</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
