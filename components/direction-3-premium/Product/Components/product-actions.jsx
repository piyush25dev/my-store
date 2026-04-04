"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Loader2, Zap } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { getAccessToken } from "@/lib/utils/getAccessToken";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ProductActions({ product }) {
  const router = useRouter();
  const { add } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginAction, setLoginAction] = useState(null); // 'add-to-cart' or 'buy-now'

  const handleAddToCart = async () => {
    // Check if user is logged in
    try {
      await getAccessToken();
    } catch (err) {
      // User is not authenticated
      setLoginAction("add-to-cart");
      setShowLoginDialog(true);
      return;
    }

    try {
      setAddingToCart(true);
      setCartError("");
      await add(product, 1, null, null);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (err) {
      setCartError(err.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    // Check if user is logged in
    try {
      await getAccessToken();
    } catch (err) {
      // User is not authenticated
      setLoginAction("buy-now");
      setShowLoginDialog(true);
      return;
    }

    // Proceed with checkout
    router.push(`/checkout?product=${product.id}`);
  };

  function handleLoginRedirect() {
    router.push("/auth/login");
    setShowLoginDialog(false);
  }

  return (
    <>
      <div className="space-y-4">
        {product.in_stock ? (
          <>
            {cartError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {cartError}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Add to Cart */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={`h-14 w-full text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${
                  addedToCart
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700"
                }`}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Adding...
                  </>
                ) : addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart · ₹
                    {product.price}
                  </>
                )}
              </Button>

              {/* Buy Now */}
              <Button
                size="lg"
                onClick={handleBuyNow}
                variant="outline"
                className="h-14 w-full text-base sm:text-lg font-semibold border-2 hover:border-gray-900 hover:bg-gray-50/70 transition gap-2"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Secure checkout · Instant access
            </p>
          </>
        ) : (
          <Button
            size="lg"
            disabled
            className="h-14 w-full text-base sm:text-lg font-semibold bg-gray-100 text-gray-500"
          >
            Out of stock — Notify me
          </Button>
        )}
      </div>

      {/* Login Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign In Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in to{" "}
              {loginAction === "buy-now"
                ? "proceed with checkout"
                : "add items to your cart"}
              . It only takes a moment!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginRedirect}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}