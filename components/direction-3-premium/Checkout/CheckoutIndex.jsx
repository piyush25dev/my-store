"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "./components/progress-steps";
import { ContactForm } from "./components/contact-form";
import { PaymentMethod } from "./components/payment-method";
import { OrderSummary } from "./components/order-summary";
import { ThankYouModal } from "./components/thank-you-modal";
import { useCart } from "@/lib/hooks/useCart";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, itemCount, loading: cartLoading, order } = useCart();

  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showThankYou, setShowThankYou] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cart.length === 0) {
      router.replace("/cart");
    }
  }, [cart, cartLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setProcessing(true);

    try {
      // Validate form
      const requiredFields = [
        "name",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "pincode",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(", ")}`,
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate phone (basic check for Indian numbers)
      if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      // Validate pincode
      if (!/^\d{6}$/.test(formData.pincode)) {
        throw new Error("Please enter a valid 6-digit pincode");
      }

      // Validate card details if card payment is selected
      if (paymentMethod === "card") {
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
          throw new Error("Please fill in all card details");
        }

        // Basic card validation
        const cardNum = formData.cardNumber.replace(/\s/g, "");
        if (!/^\d{13,19}$/.test(cardNum)) {
          throw new Error("Please enter a valid card number");
        }

        if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
          throw new Error("Expiry should be in MM/YY format");
        }

        if (!/^\d{3,4}$/.test(formData.cardCvc)) {
          throw new Error("Please enter a valid CVV/CVC");
        }
      }

      // IMPORTANT: Make sure cart items have prices
      if (!cart || cart.length === 0) {
        throw new Error("Cart is empty. Please add items before checkout.");
      }

      console.log("[Checkout] Cart items:", cart);
      console.log(
        "[Checkout] Cart item details:",
        cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
        })),
      );

      // Prepare order data with prices from cart
      const orderData = {
        items: cart.map((item) => {
          // Get the unit price - it should be in the cart item
          const unitPrice = item.unit_price;

          if (!unitPrice || unitPrice <= 0) {
            throw new Error(
              `Item ${item.product_name} has invalid price: ${unitPrice}`,
            );
          }

          return {
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            quantity: item.quantity || 1,
            price: unitPrice, // THIS MUST BE SET
            product_name: item.product_name,
            variant_label: item.variant_label,
          };
        }),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        paymentInfo: {
          method: paymentMethod,
        },
      };

      console.log("[Checkout] Order data being sent:", orderData);

      // Get auth token
      let token = null;

      if (typeof window !== "undefined") {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes("auth-token")) {
            try {
              const value = localStorage.getItem(key);
              const tokenData = JSON.parse(value);
              token = tokenData.access_token || tokenData;
              break;
            } catch {
              continue;
            }
          }
        }
      }

      if (!token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      console.log("[Checkout] Sending request to /api/orders");

      // Send order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log("[Checkout] Response status:", response.status);

      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }

      if (!response.ok) {
        const data = await response.json();
        console.error("[Checkout] API error:", data);
        throw new Error(
          data.error || `Order creation failed: ${response.status}`,
        );
      }

      const result = await response.json();
      console.log("[Checkout] Order created successfully:", result);

      // Show thank you modal
      const grandTotal = total / 100 + (total > 49900 ? 0 : 49);
      setShowThankYou(true);
    } catch (error) {
      console.error("[Checkout] Order submission error:", error);
      setSubmitError(
        error.message || "Failed to process order. Please try again.",
      );
      setProcessing(false);
    }
  };

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-rose-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-stone-900 mx-auto" />
          <p className="text-sm text-gray-600">Loading your checkout...</p>
        </div>
      </div>
    );
  }

  // Empty cart redirect handled above, but guard just in case
  if (cart.length === 0) {
    return null;
  }

  const subtotal = total / 100;
  const tax = Math.round(subtotal * 0.18);
  const shipping = total > 49900 ? 0 : 49;
  const grandTotal = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white to-rose-50/20">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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
            Back to Cart
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Steps */}
              <ProgressSteps currentStep={2} />

              {/* Error Alert */}
              {submitError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200/50">
                  <p className="text-sm text-red-700 font-medium">
                    {submitError}
                  </p>
                </div>
              )}

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
                items={cart}
                subtotal={subtotal}
                tax={tax}
                shipping={shipping}
                total={grandTotal}
                onSubmit={handleSubmit}
                loading={processing}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Thank You Modal */}
      <ThankYouModal
        open={showThankYou}
      onClose={() => setShowThankYou(false)}
        orderDetails={{
          total: grandTotal.toFixed(2),
          itemCount,
        }}
      />
    </div>
  );
}
