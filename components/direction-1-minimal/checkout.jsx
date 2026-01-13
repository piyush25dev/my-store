import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function CheckoutMinimal() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-8">
      <h1 className="text-xl font-bold text-center">Checkout</h1>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="font-medium">Order Summary</h2>
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Notion Creator Kit</span>
            <span>₹799</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹799</span>
          </div>
        </CardContent>
      </Card>

      {/* Guest Checkout Form */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label>Email</Label>
            <Input placeholder="you@email.com" />
          </div>

          <div>
            <Label>Shipping Address</Label>
            <Input placeholder="Street, City, Pincode" />
          </div>

          {/* Error Visibility */}
          <Alert>
            <AlertDescription>
              Please ensure your email is correct to receive access.
            </AlertDescription>
          </Alert>

          <Button className="w-full">Pay ₹799</Button>
        </CardContent>
      </Card>

      {/* Success State */}
      <div className="text-center text-sm text-muted-foreground">
        ✓ Payment successful. Confirmation sent to your email.
      </div>
    </div>
  );
}
