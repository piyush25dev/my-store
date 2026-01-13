import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPremium() {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-background border rounded-2xl shadow-sm">
        {/* Header */}
        <div className="px-6 py-5 border-b">
          <h1 className="text-xl font-semibold">
            Secure Checkout
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete your purchase in a few steps
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT — CUSTOMER DETAILS */}
          <div className="px-6 py-6 space-y-6">
            <section className="space-y-3">
              <h2 className="font-medium">
                Contact information
              </h2>

              <div className="space-y-2">
                <Label>Email address</Label>
                <Input placeholder="you@example.com" />
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <h2 className="font-medium">
                Billing details
              </h2>

              <div className="space-y-2">
                <Label>Billing address</Label>
                <Input placeholder="Street, City, Country" />
              </div>
            </section>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="bg-muted/30 px-6 py-6 space-y-6 border-t md:border-t-0 md:border-l">
            <section className="space-y-4">
              <h2 className="font-medium">
                Order summary
              </h2>

              <div className="flex justify-between text-sm">
                <span>Signature Creator System</span>
                <span>₹2,499</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹2,499</span>
              </div>
            </section>

            <Button size="lg" className="w-full">
              Pay ₹2,499
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Secure payment · Instant access · Premium support
            </p>
          </div>
        </div>

        {/* FOOTER CONFIRMATION (POST-PAY STATE) */}
        <div className="px-6 py-4 border-t text-center text-sm text-muted-foreground">
          ✓ Payment successful. Access details will be sent to your email.
        </div>
      </div>
    </div>
  );
}
