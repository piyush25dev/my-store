"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { products } from "@/app/data/product";

import { Button } from "@/components/ui/button";
import { ProgressSteps } from "./components/progress-steps";
import { ContactForm } from "./components/contact-form";
import { PaymentMethod } from "./components/payment-method";
import { OrderSummary } from "./components/order-summary";
import { SecurityBadge } from "./components/security-badge";
import { ThankYouModal } from "./components/thank-you-modal";

export default function CheckoutIndex() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showThankYou, setShowThankYou] = useState(false);

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
    setProcessing(true);

    // Validate form
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setProcessing(false);
      return;
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show thank you modal instead of routing
    setProcessing(false);
    setShowThankYou(true);
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
    return null;
  }

  const orderDetails = {
    name: product.name,
    type: product.type,
    total: (product.price * 1.18).toFixed(2)
  };

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

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Steps */}
              <ProgressSteps currentStep={2} />

              {/* Contact & Shipping Form */}
              <ContactForm formData={formData} setFormData={setFormData} />

              {/* Payment Method */}
              <PaymentMethod 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-8">
              <OrderSummary 
                product={product} 
                onSubmit={handleSubmit}
                loading={processing}
              />
              {/* <SecurityBadge /> */}
            </div>
          </div>
        </form>
      </div>

      {/* Thank You Modal */}
      <ThankYouModal 
        open={showThankYou}
        onClose={() => setShowThankYou(false)}
        orderDetails={orderDetails}
      />
    </div>
  );
}