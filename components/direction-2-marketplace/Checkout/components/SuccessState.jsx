import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Gift,
  Download,
  Package,
  Users,
  ArrowRight,
} from "lucide-react";
import CheckoutHeader from "./CheckoutHeader";
import Link from "next/link";

export default function SuccessState({
  product,
  formData,
  calculateTotal,
  orderId,
}) {
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <CheckoutHeader product={product} />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Card className="border-green-200 shadow-xl">
          <CardContent className="p-6 sm:p-8 md:p-12">
            <div className="text-center space-y-8">
              {/* Success Icon */}
              <div className="relative inline-block">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Payment Successful!
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  Your order for{" "}
                  <span className="font-semibold text-gray-900">
                    {product.name}
                  </span>{" "}
                  has been confirmed.
                </p>
              </div>

              {/* Details */}
              <div className="max-w-md mx-auto space-y-6">
                <Card>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 text-sm md:text-lg">
                        Order ID
                      </span>
                      <span className="font-mono font-bold truncate">
                        {orderId}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 text-sm md:text-lg">
                        Payment Date
                      </span>
                      <span className="font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 text-sm md:text-lg">
                        Amount Paid
                      </span>
                      <span className="text-xl sm:text-2xl font-bold">
                        ₹{total}
                      </span>
                    </div>
                    <Separator />
                    <div className="space-y-1 text-left">
                      <p className="text-sm text-gray-600">
                        Confirmation sent to:
                      </p>
                      <p className="font-medium break-all">{formData.email}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold mb-4">What happens next?</h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: <Download className="w-3 h-3 text-blue-600" />,
                          bg: "bg-blue-100",
                          title: "Instant Access",
                          desc: "Your product is now available in your account dashboard.",
                        },
                        {
                          icon: <Package className="w-3 h-3 text-green-600" />,
                          bg: "bg-green-100",
                          title: "Download Instructions",
                          desc: "Check your email for download links and setup instructions.",
                        },
                        {
                          icon: <Users className="w-3 h-3 text-purple-600" />,
                          bg: "bg-purple-100",
                          title: "Customer Support",
                          desc: "Need help? Contact our support team anytime.",
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full ${item.bg} flex items-center justify-center shrink-0`}
                          >
                            {item.icon}
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-6">
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:flex-1 gap-2"
                >
                  <Link href="/mockups/direction-2-marketplace/store">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild className="w-full sm:flex-1 gap-2">
                  <Link
                    href={`/mockups/direction-2-marketplace/product/${product.id}`}
                  >
                    View Product Details
                  </Link>
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t">
                <p className="text-sm text-gray-500">
                  Questions about your order?{" "}
                  <Link
                    href="/support"
                    className="text-blue-600 hover:underline"
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
