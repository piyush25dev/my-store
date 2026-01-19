// components/direction-1-minimal/checkout.jsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/app/mockups/direction-1-minimal/data/product";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define helper components outside the main component
const OrderSummary = ({ selectedProduct, calculateTotal }) => (
  <Card>
    <CardContent className="p-6">
      <h2 className="font-medium mb-4 flex items-center justify-between">
        <span>Order Summary</span>
        {selectedProduct.originalPrice && (
          <Badge variant="secondary">
            {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
          </Badge>
        )}
      </h2>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedProduct.image})` }}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{selectedProduct.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{selectedProduct.tagline}</p>
          </div>
          <div className="text-right">
            <div className="font-bold">₹{selectedProduct.price}</div>
            {selectedProduct.originalPrice && (
              <div className="text-sm line-through text-muted-foreground">
                ₹{selectedProduct.originalPrice}
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{selectedProduct.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform fee</span>
            <span>₹0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST (18%)</span>
            <span>₹{Math.round(selectedProduct.price * 0.18)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold">Total</span>
            <div>
              <div className="text-2xl font-bold">
                ₹{calculateTotal()}
              </div>
              <div className="text-xs text-muted-foreground">
                Inclusive of all taxes
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ContactForm = ({ 
  formData, 
  errors, 
  isSubmitting, 
  handleInputChange, 
  handleSubmit, 
  calculateTotal 
}) => (
  <Card>
    <CardContent className="p-6">
      <h2 className="font-medium mb-4 flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Contact Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Access details will be sent to this email
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Street address</Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main Street"
            value={formData.address}
            onChange={handleInputChange}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="Enter Your City"
              value={formData.city}
              onChange={handleInputChange}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className={errors.pincode ? "border-red-500" : ""}
            />
            {errors.pincode && (
              <p className="text-sm text-red-500">{errors.pincode}</p>
            )}
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
          <AlertDescription className="text-sm">
            Your payment information is secured with 256-bit SSL encryption. 
            We never store your credit card details.
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay ₹${calculateTotal()}`
          )}
        </Button>
      </form>
    </CardContent>
  </Card>
);

const SuccessState = ({ selectedProduct, formData, calculateTotal }) => (
  <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 col-span-1 lg:col-span-2">
    <CardContent className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-muted-foreground mb-6">
        Your order for <strong>{selectedProduct.name}</strong> has been confirmed.
      </p>
      <div className="max-w-md mx-auto space-y-4 mb-8">
        <div className="text-sm">
          <p>Order confirmation has been sent to:</p>
          <p className="font-medium">{formData.email}</p>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span>Order Total</span>
          <span className="text-lg font-bold">₹{calculateTotal()}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/mockups/direction-1-minimal/store">
            Continue Shopping
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/mockups/direction-1-minimal/product/${selectedProduct.id}`}>
            View Product
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function CheckoutMinimal({ productId: initialProductId = null }) {
  const router = useRouter();
  
  // Get productId from URL if not provided as prop
  const getProductIdFromURL = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get("product");
    }
    return initialProductId;
  };

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getProduct = (id) => {
    return products.find(p => p.id === id);
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeCheckout = async () => {
      // Get productId from URL
      const productId = getProductIdFromURL();
      
      if (!productId) {
        setTimeout(() => {
          if (mounted) {
            router.push("/mockups/direction-1-minimal/store");
          }
        }, 0);
        return;
      }
      
      setTimeout(() => {
        if (mounted) {
          const product = getProduct(productId);
          if (product) {
            setSelectedProduct(product);
          } else {
            router.push("/mockups/direction-1-minimal/store");
          }
          setIsLoading(false);
        }
      }, 0);
    };

    initializeCheckout();

    return () => {
      mounted = false;
    };
  }, ); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    const gst = Math.round(selectedProduct.price * 0.18);
    return selectedProduct.price + gst;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The product you&apos;re trying to purchase is no longer available.
            </p>
            <Button asChild>
              <Link href="/mockups/direction-1-minimal/store">
                Browse Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href={`/mockups/direction-1-minimal/product/${selectedProduct.id}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to product
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Complete Your Purchase</h1>
          <p className="text-muted-foreground mt-2">
            You&apos;re buying: <span className="font-medium text-foreground">{selectedProduct.name}</span>
          </p>
        </div>

        {isSuccess ? (
          <SuccessState 
            selectedProduct={selectedProduct} 
            formData={formData} 
            calculateTotal={calculateTotal}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary (Desktop) / Top (Mobile) */}
            <div className="space-y-6">
              <div className="lg:hidden">
                <OrderSummary 
                  selectedProduct={selectedProduct} 
                  calculateTotal={calculateTotal}
                />
              </div>
              
              <div className="hidden lg:block">
                <OrderSummary 
                  selectedProduct={selectedProduct} 
                  calculateTotal={calculateTotal}
                />
              </div>

              {/* Additional Info - Only in left column on desktop, bottom on mobile */}
              <div className="text-center lg:text-left">
                <p className="text-xs text-muted-foreground">
                  By completing your purchase, you agree to our{" "}
                  <a href="#" className="underline hover:text-foreground">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-foreground">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <ContactForm 
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                calculateTotal={calculateTotal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}