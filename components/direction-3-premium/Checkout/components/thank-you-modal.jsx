"use client";

import { useState } from "react";
import { CheckCircle, Download, Mail, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ThankYouModal({ open, onClose, orderDetails }) {
  const [isCopied, setIsCopied] = useState(false);
  const [orderId] = useState(() => `ORD${Date.now().toString().slice(-8)}`);

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy order ID:", err);
    }
  };

  // ✅ Replaced download with alert
  const handleDownloadInvoice = () => {
    alert("Invoice will be emailed to you shortly.");
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
    max-w-5xl w-[95vw] sm:w-full
    border-0 bg-gradient-to-br from-white to-gray-50/50
    backdrop-blur-sm p-0
  "
      >
        <DialogTitle className="sr-only">
          Order Confirmation - Payment Successful
        </DialogTitle>

        <div className="space-y-8 p-5 sm:p-6">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Payment Successful! 🎉
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <div className="rounded-2xl p-5 sm:p-6 border border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Order ID</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-semibold text-gray-900 text-sm">
                      {orderId}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 relative"
                      onClick={handleCopyOrderId}
                    >
                      <Copy className="h-3 w-3" />
                      {isCopied && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                          Copied!
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
                <Badge className="w-fit bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  Confirmed
                </Badge>
              </div>

              <Separator className="my-4 bg-gray-200/50" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium text-gray-900 text-right">
                    {orderDetails?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-medium text-gray-900">
                    ₹{orderDetails?.total}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900">Credit Card</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-gray-900">
                    {orderDetails?.type === "Digital"
                      ? "Instant access"
                      : "3–5 business days"}
                  </span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What&apos;s next?</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Email */}
                <div className="p-4 rounded-xl border border-gray-200/50 bg-gradient-to-br from-blue-50/30 to-white/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Receipt</p>
                      <p className="text-xs text-gray-600">
                        Sent to your inbox
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    A confirmation email with access details has been sent.
                  </p>
                </div>

                {/* Invoice */}
                <div className="p-4 rounded-xl border border-gray-200/50 bg-gradient-to-br from-purple-50/30 to-white/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Invoice</p>
                      <p className="text-xs text-gray-600">Sent via email</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleDownloadInvoice}
                  >
                    View invoice info
                  </Button>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="p-4 rounded-xl border border-emerald-200/50 bg-gradient-to-r from-emerald-50/30 to-white/30">
              <p className="text-sm text-gray-600">
                Need help? Contact{" "}
                <a
                  href="mailto:support@premiumstore.com"
                  className="text-emerald-600 font-medium hover:underline"
                >
                  support@premiumstore.com
                </a>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Continue shopping
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700"
              onClick={() => (window.location.href = "/orders")}
            >
              View order status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
