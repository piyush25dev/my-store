"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Download, Mail, Copy, Home } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ThankYouModal({ open, onClose, orderDetails = {} }) {
  const [isCopied, setIsCopied] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (open && !orderId) {
      // Generate order ID only when modal opens
      const newOrderId = `ORD${Date.now().toString().slice(-8)}`;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderId(newOrderId);
    }
  }, [open, orderId]);

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy order ID:", err);
    }
  };

  const handleDownloadInvoice = () => {
    alert(
      "Your invoice will be sent to your email shortly. Check your inbox for the PDF."
    );
  };

  const handleContinueShopping = () => {
    onClose?.();
    window.location.href = "/";
  };

  const handleViewOrders = () => {
    onClose?.();
    window.location.href = "/dashboard/customer/orders";
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{
          overflowY: "auto",
          maxHeight: "90vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="
          max-w-2xl w-[95vw] sm:w-full
          border-0 bg-gradient-to-br from-white to-gray-50/50
          backdrop-blur-sm p-0
        "
      >
        <DialogTitle className="sr-only">
          Order Confirmation - Payment Successful
        </DialogTitle>

        <div className="space-y-8 p-6 sm:p-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="relative h-20 w-20 mx-auto">
              {/* Animated circle background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Payment Successful! 🎉
              </h2>
              <p className="text-base text-gray-600 mt-2">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="rounded-2xl p-6 border border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wider">
                  Order ID
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="font-mono font-semibold text-gray-900 text-base">
                    {orderId}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 relative hover:bg-gray-200/50"
                    onClick={handleCopyOrderId}
                    aria-label="Copy order ID"
                  >
                    <Copy className="h-4 w-4" />
                    {isCopied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              <Badge className="w-fit bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                Order Confirmed
              </Badge>
            </div>

            <Separator className="my-4 bg-gray-200/50" />

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Items</span>
                <span className="font-medium text-gray-900 text-right">
                  {orderDetails.itemCount || 1} item
                  {orderDetails.itemCount !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold text-gray-900">
                  ₹{parseFloat(orderDetails.total || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900">Credit/Debit Card</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Delivery Status</span>
                <span className="font-medium text-emerald-600">
                  Processing (3-5 business days)
                </span>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">
              What happens next?
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Email Confirmation */}
              <div className="p-4 rounded-xl border border-gray-200/50 bg-gradient-to-br from-blue-50/30 to-white/30 hover:border-blue-200/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Confirmation Email</p>
                    <p className="text-xs text-gray-600 mt-1">
                      A detailed receipt will be sent to your email address
                      shortly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice */}
              <div className="p-4 rounded-xl border border-gray-200/50 bg-gradient-to-br from-purple-50/30 to-white/30 hover:border-purple-200/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Invoice PDF</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Your invoice will be attached to the confirmation email
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="p-4 rounded-xl border border-emerald-200/50 bg-gradient-to-r from-emerald-50/30 to-white/30">
              <p className="text-sm text-gray-700">
                Need help?{" "}
                <a
                  href="mailto:support@store.com"
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Contact our support team
                </a>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/50">
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleContinueShopping}
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 gap-2"
              onClick={handleViewOrders}
            >
              View All Orders
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}