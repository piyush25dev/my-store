"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Lock,
  CreditCard,
  Truck,
  CheckCircle,
} from "lucide-react";

import { products } from "@/app/data/product";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CheckoutIndex() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
  });

  // ✅ Properly handle product loading with loading state
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        router.replace("/mockups/direction-3-premium/store");
        return;
      }

      setLoading(true);

      // Simulate async loading
      await new Promise((resolve) => setTimeout(resolve, 100));

      const foundProduct = products.find((p) => p.id === productId);

      if (!foundProduct) {
        router.replace("/mockups/direction-3-premium/store");
        return;
      }

      setProduct(foundProduct);
      setLoading(false);
    };

    loadProduct();
  }, [productId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle payment submission
    console.log("Processing payment...", formData);

    // In a real app, you would integrate with a payment gateway here
    router.push(`/thank-you?order=${productId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-rose-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 mx-auto" />
          <p className="text-sm text-gray-600">
            Loading your premium checkout...
          </p>
        </div>
      </div>
    );
  }

  // Guard for no product
  if (!product) {
    return null; // Router will handle redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-rose-50/20">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-emerald-100/20 to-teal-100/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Product
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-between max-w-md">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <span className="text-xs mt-2 text-gray-900 font-medium">
                  Cart
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-900 to-gray-300 mx-4" />
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">2</span>
                </div>
                <span className="text-xs mt-2 text-gray-900 font-medium">
                  Details
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-gray-300 mx-4" />
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-semibold">3</span>
                </div>
                <span className="text-xs mt-2 text-gray-400">Payment</span>
              </div>
            </div>

            {/* Contact & Shipping Form */}
            <Card className="border border-gray-200/50 bg-white/50 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact & Shipping
                </h2>
                <p className="text-sm text-gray-600">
                  Enter your details for order processing
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="bg-white/50 border-gray-300/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Email Address</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      type="email"
                      className="bg-white/50 border-gray-300/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="9876543210"
                    type="tel"
                    className="bg-white/50 border-gray-300/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Street Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Main Street"
                    className="bg-white/50 border-gray-300/50"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Mumbai"
                      className="bg-white/50 border-gray-300/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">State</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      placeholder="Maharashtra"
                      className="bg-white/50 border-gray-300/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Pincode</Label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      placeholder="400001"
                      className="bg-white/50 border-gray-300/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border border-gray-200/50 bg-white/50 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Method
                </h2>
                <p className="text-sm text-gray-600">
                  Select your preferred payment option
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200/50 data-[state=checked]:border-gray-900">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-12 rounded bg-gradient-to-r from-blue-500 to-blue-600" />
                          <div className="h-8 w-12 rounded bg-gradient-to-r from-red-500 to-orange-500" />
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200/50 data-[state=checked]:border-gray-900">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded bg-gradient-to-r from-purple-500 to-blue-500" />
                          <span className="font-medium">UPI</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Instant
                        </Badge>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200/50 data-[state=checked]:border-gray-900">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label
                      htmlFor="netbanking"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded bg-gradient-to-r from-green-500 to-emerald-500" />
                          <span className="font-medium">Net Banking</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 p-4 rounded-xl border border-gray-200/50 bg-white/30">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Card Number</Label>
                        <Input
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardNumber: e.target.value,
                            })
                          }
                          placeholder="1234 5678 9012 3456"
                          className="bg-white/50 border-gray-300/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Cardholder Name</Label>
                        <Input
                          value={formData.cardName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardName: e.target.value,
                            })
                          }
                          placeholder="John Doe"
                          className="bg-white/50 border-gray-300/50"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Expiry Date</Label>
                        <Input
                          value={formData.cardExpiry}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardExpiry: e.target.value,
                            })
                          }
                          placeholder="MM/YY"
                          className="bg-white/50 border-gray-300/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">CVC</Label>
                        <Input
                          value={formData.cardCvc}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardCvc: e.target.value,
                            })
                          }
                          placeholder="123"
                          className="bg-white/50 border-gray-300/50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
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
                    <span>₹{(product.price * 0.18).toFixed(2)}</span>
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
                      ₹{(product.price * 1.18).toFixed(2)}
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
                  onClick={handleSubmit}
                >
                  Pay ₹{(product.price * 1.18).toFixed(2)}
                </Button>
              </CardFooter>
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/30 to-white/30 border border-emerald-200/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Premium Security
                    </p>
                    <p className="text-xs text-gray-600">
                      This transaction is secured and encrypted
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
