// app/mockups/direction-2-marketplace/checkout/page.jsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products } from "@/app/data/product";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Shield,
  Lock,
  CreditCard,
  Wallet,
  CheckCircle2,
  Truck,
  RotateCcw,
  Users,
  Package,
  Download,
  Clock,
  Star,
  AlertCircle,
  ChevronDown,
  Info,
  Gift,
  Tag,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  Banknote,
  QrCode,
  Smartphone,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

// Loading Component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-lg font-medium">Loading your checkout...</p>
      <p className="text-sm text-gray-500">Preparing your order details</p>
    </div>
  </div>
);

// Product Not Found Component
const ProductNotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <Card className="max-w-md w-full">
      <CardContent className="p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600">
            The product you&apos;re trying to purchase is no longer available or doesn&apos;t exist.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/mockups/direction-2-marketplace/store">
            Browse Marketplace
          </Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Checkout Header Component
const CheckoutHeader = ({ product }) => (
  <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Link
            href={`/mockups/direction-2-marketplace/product/${product.id}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to product
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm">
            <span className="text-gray-500">Ordering:</span>
            <span className="font-medium ml-2">{product.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Lock className="w-3 h-3" />
            Secure Checkout
          </Badge>
          <div className="text-sm text-gray-500">
            Step 2 of 3
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Checkout Progress Component
const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Cart", status: "completed" },
    { id: 2, label: "Checkout", status: currentStep === 2 ? "current" : "upcoming" },
    { id: 3, label: "Confirmation", status: "upcoming" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === "completed" 
                  ? "bg-green-500 text-white" 
                  : step.status === "current"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {step.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                step.status === "current" ? "text-blue-500" : "text-gray-500"
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-24 h-1 mx-2 ${
                steps[index + 1].status === "completed" || step.status === "completed"
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ product, formData, paymentMethod, calculateTotal }) => {
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
            <div className="w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{product.tagline}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{product.price}</div>
                  {product.originalPrice && (
                    <div className="text-sm line-through text-gray-500">
                      ₹{product.originalPrice}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
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
              <div className="text-xs text-gray-500">Inclusive of all taxes</div>
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
};

// Contact Information Component
const ContactInformation = ({ formData, onFormChange, errors }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">1</span>
          </div>
          <h3 className="font-semibold">Contact Information</h3>
        </div>
        <Badge variant="outline" className="gap-1">
          <Users className="w-3 h-3" />
          Required
        </Badge>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={onFormChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
          <p className="text-xs text-gray-500">
            Order confirmation and product access will be sent here
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={onFormChange}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
          <p className="text-xs text-gray-500">
            For delivery updates and support
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={onFormChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="w-4 h-4" />
        <AlertDescription className="text-sm">
          We&apos;ll use this information to send your order confirmation and product access details.
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Billing Information Component
const BillingInformation = ({ formData, onFormChange, errors }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">2</span>
          </div>
          <h3 className="font-semibold">Billing Information</h3>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="same-as-shipping" />
          <Label htmlFor="same-as-shipping" className="text-sm">
            Same as shipping address
          </Label>
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main Street, Apt 4B"
            value={formData.address}
            onChange={onFormChange}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={onFormChange}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={onFormChange}
            className={errors.state ? "border-red-500" : ""}
          />
          {errors.state && (
            <p className="text-sm text-red-500">{errors.state}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">PIN Code *</Label>
          <Input
            id="pincode"
            name="pincode"
            placeholder="560001"
            value={formData.pincode}
            onChange={onFormChange}
            className={errors.pincode ? "border-red-500" : ""}
          />
          {errors.pincode && (
            <p className="text-sm text-red-500">{errors.pincode}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            name="country"
            placeholder="India"
            value={formData.country}
            onChange={onFormChange}
            className={errors.country ? "border-red-500" : ""}
          />
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Billing Type</Label>
        <RadioGroup defaultValue="personal" className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 border rounded-lg p-4">
            <RadioGroupItem value="personal" id="personal" />
            <Label htmlFor="personal" className="flex-1 cursor-pointer">
              <div className="font-medium">Personal</div>
              <div className="text-sm text-gray-500">For personal use</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-4">
            <RadioGroupItem value="business" id="business" />
            <Label htmlFor="business" className="flex-1 cursor-pointer">
              <div className="font-medium">Business</div>
              <div className="text-sm text-gray-500">With GST invoice</div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </CardContent>
  </Card>
);

// Payment Methods Component
const PaymentMethods = ({ paymentMethod, setPaymentMethod, formData }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">3</span>
          </div>
          <h3 className="font-semibold">Payment Method</h3>
        </div>
        <Badge variant="outline" className="gap-1">
          <Lock className="w-3 h-3" />
          Secure & Encrypted
        </Badge>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-6">
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="upi" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            UPI
          </TabsTrigger>
          <TabsTrigger value="netbanking" className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            Net Banking
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallets
          </TabsTrigger>
        </TabsList>

        <div className="pt-6">
          {/* Cards Tab */}
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border rounded-lg p-4 hover:border-blue-500 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <div>
                      <Label htmlFor="credit-card" className="font-medium cursor-pointer">
                        Credit / Debit Card
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <div className="text-xs px-2 py-1 bg-gray-100 rounded">VISA</div>
                        <div className="text-xs px-2 py-1 bg-gray-100 rounded">MasterCard</div>
                        <div className="text-xs px-2 py-1 bg-gray-100 rounded">RuPay</div>
                      </div>
                    </div>
                  </div>
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>

                <div className="flex items-center justify-between border rounded-lg p-4 hover:border-blue-500 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <div>
                      <Label htmlFor="paypal" className="font-medium cursor-pointer">
                        PayPal
                      </Label>
                      <div className="text-sm text-gray-500">Pay securely with PayPal</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-800">PP</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border rounded-lg p-4 hover:border-blue-500 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="google-pay" id="google-pay" />
                    <div>
                      <Label htmlFor="google-pay" className="font-medium cursor-pointer">
                        Google Pay
                      </Label>
                      <div className="text-sm text-gray-500">Fast & secure payments</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded bg-white border flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-800">G Pay</span>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Tabs>

      {/* Card Details Form */}
      {paymentMethod === "credit-card" && (
        <div className="space-y-4 border-t pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-name">Name on Card</Label>
              <Input
                id="card-name"
                placeholder={formData.name || "John Doe"}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="save-card">Save for later</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="save-card" />
                <Label htmlFor="save-card" className="text-sm">
                  Save card securely
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPI Payment */}
      {paymentMethod === "upi" && (
        <div className="space-y-4 border-t pt-6">
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input
              id="upi-id"
              placeholder="username@upi"
              className="font-mono"
            />
          </div>
          <Button variant="outline" className="w-full gap-2">
            <QrCode className="w-4 h-4" />
            Show QR Code for Payment
          </Button>
        </div>
      )}

      <Alert className="bg-green-50 border-green-200">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <AlertTitle className="text-green-700">Payment Security</AlertTitle>
        <AlertDescription className="text-sm text-green-600">
          All transactions are secured with 256-bit SSL encryption. We never store your payment details.
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Success State Component
const SuccessState = ({ product, formData, calculateTotal, orderId }) => {
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <CheckoutHeader product={product} />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-green-200 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-8">
              {/* Success Icon */}
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Payment Successful!</h1>
                <p className="text-gray-600 text-lg">
                  Your order for <span className="font-semibold text-gray-900">{product.name}</span> has been confirmed.
                </p>
              </div>

              {/* Order Details */}
              <div className="max-w-md mx-auto space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Order ID</span>
                      <span className="font-mono font-bold">{orderId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment Date</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="text-2xl font-bold">₹{total}</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Confirmation sent to:</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">What happens next?</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Download className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Instant Access</p>
                          <p className="text-sm text-gray-600">
                            Your product is now available in your account dashboard.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Download Instructions</p>
                          <p className="text-sm text-gray-600">
                            Check your email for download links and setup instructions.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Users className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Customer Support</p>
                          <p className="text-sm text-gray-600">
                            Need help? Contact our support team anytime.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-6">
                <Button asChild variant="outline" className="flex-1 gap-2">
                  <Link href="/mockups/direction-2-marketplace/store">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild className="flex-1 gap-2">
                  <Link href={`/mockups/direction-2-marketplace/product/${product.id}`}>
                    View Product Details
                  </Link>
                </Button>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-8 border-t">
                <p className="text-sm text-gray-500">
                  Questions about your order?{" "}
                  <Link href="/support" className="text-blue-600 hover:underline">
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
};

// Order ID Generator
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp.toString(36).slice(-6)}-${random.toString().padStart(4, '0')}`;
};

// Main Checkout Component
export default function CheckoutMarketplace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [orderId, setOrderId] = useState("");  
  // Use refs to track initialization state
  const initializedRef = useRef(false);

  // Calculate total
  const calculateTotal = useCallback(() => {
    if (!product) return 0;
    const subtotal = product.price;
    const gst = Math.round(subtotal * 0.18);
    return subtotal + gst;
  }, [product]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Phone must be 10 digits";
    
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.pincode) newErrors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "PIN must be 6 digits";
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstError = Object.keys(validationErrors)[0];
      document.getElementById(firstError)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    
    // Generate order ID only when needed (during submission)
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Initialize checkout - Using setTimeout to avoid synchronous state updates
  useEffect(() => {
    // Prevent double initialization
    if (initializedRef.current) return;
    
    const timer = setTimeout(() => {
      if (!productId) {
        router.push("/mockups/direction-2-marketplace/store");
        setIsLoading(false);
        initializedRef.current = true;
        return;
      }

      const foundProduct = products.find(p => p.id === productId);
      if (!foundProduct) {
        router.push("/mockups/direction-2-marketplace/store");
        setIsLoading(false);
        initializedRef.current = true;
        return;
      }

      // Update states in a single batch
      setProduct(foundProduct);
      setFormData(prev => ({
        ...prev,
        email: "customer@example.com",
        phone: "9876543210",
        name: "John Doe",
      }));
      setIsLoading(false);
      initializedRef.current = true;
    }, 0);

    return () => clearTimeout(timer);
  }, [productId, router]);

  if (isLoading) return <LoadingState />;
  if (!product && !isLoading) return <ProductNotFound />;
  if (isSuccess) return <SuccessState 
    product={product} 
    formData={formData} 
    calculateTotal={calculateTotal}
    orderId={orderId}
  />;

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutHeader product={product} />
      <CheckoutProgress currentStep={2} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2 space-y-8">
            <ContactInformation 
              formData={formData} 
              onFormChange={handleFormChange} 
              errors={errors} 
            />
            
            <BillingInformation 
              formData={formData} 
              onFormChange={handleFormChange} 
              errors={errors} 
            />
            
            <PaymentMethods 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              formData={formData}
            />

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" className="mt-1" />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>
                      ,{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      , and authorize the processing of my personal data to handle my
                      order and for other purposes described in the Privacy Policy.
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="newsletter" className="mt-1" />
                    <Label htmlFor="newsletter" className="text-sm cursor-pointer">
                      Yes, I want to receive exclusive offers and updates via email.
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full h-14 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                `Pay ₹${calculateTotal()}`
              )}
            </Button>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary 
              product={product}
              formData={formData}
              paymentMethod={paymentMethod}
              calculateTotal={calculateTotal}
            />
            
            {/* Need Help Card */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Need Help?</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email Support</span>
                    <span className="font-medium">support@marketplace.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">+91 1800-123-4567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Live Chat</span>
                    <span className="font-medium">Available 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}