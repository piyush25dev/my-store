"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products } from "@/app/data/product";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Users } from "lucide-react";

// Import Components
import LoadingState from "./components/LoadingState";
import ProductNotFound from "./components/ProductNotFound";
import CheckoutHeader from "./components/CheckoutHeader";
import CheckoutProgress from "./components/CheckoutProgress";
import OrderSummary from "./components/OrderSummary";
import ContactInformation from "./components/ContactInformation";
import BillingInformation from "./components/BillingInformation";
import PaymentMethods from "./components/PaymentMethods";
import SuccessState from "./components/SuccessState";
import { generateOrderId } from "./components/helpers";

export default function CheckoutIndex() {
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
      const firstError = Object.keys(validationErrors)[0];
      document.getElementById(firstError)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    
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

  // Initialize checkout
  useEffect(() => {
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

      setProduct(foundProduct);
      setFormData(prev => ({
        ...prev,
        email: "piyush@example.com",
        phone: "9876543210",
        name: "Piyush",
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
              className="w-full text-lg"
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