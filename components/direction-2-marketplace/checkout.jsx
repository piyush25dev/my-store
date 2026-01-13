import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CheckoutMarketplace() {
  return (
    <div className="max-w-3xl mx-auto p-4 grid md:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="font-semibold">Customer Details</h2>

          <div>
            <Label>Email</Label>
            <Input />
          </div>

          <div>
            <Label>Address</Label>
            <Input />
          </div>

          <Alert>
            <AlertDescription>
              Please fill all required fields.
            </AlertDescription>
          </Alert>

          <Button className="w-full">Place Order</Button>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="font-semibold">Order Summary</h2>
          <p>Instagram Hooks Pack</p>
          <p className="font-bold">₹399</p>
        </CardContent>
      </Card>
    </div>
  );
}
