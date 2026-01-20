import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

export function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
  formData,
  setFormData,
}) {
  return (
    <Card className="border border-gray-200/50 bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 px-5 sm:px-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Payment Method
        </h2>
        <p className="text-sm text-gray-600">
          Select your preferred payment option
        </p>
      </CardHeader>

      <CardContent className="space-y-6 px-5 sm:px-6">
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="space-y-3"
        >
          {/* CARD */}
          <Label
            htmlFor="card"
            className="flex items-start sm:items-center gap-3 p-4 rounded-xl border border-gray-200/50 cursor-pointer
                       hover:border-gray-300 transition"
          >
            <RadioGroupItem value="card" id="card" className="mt-1 sm:mt-0" />
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Credit / Debit Card</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-11 rounded bg-gradient-to-r from-blue-500 to-blue-600" />
                  <div className="h-7 w-11 rounded bg-gradient-to-r from-red-500 to-orange-500" />
                </div>
              </div>
            </div>
          </Label>

          {/* UPI */}
          <Label
            htmlFor="upi"
            className="flex items-start sm:items-center gap-3 p-4 rounded-xl border border-gray-200/50 cursor-pointer
                       hover:border-gray-300 transition"
          >
            <RadioGroupItem value="upi" id="upi" className="mt-1 sm:mt-0" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded bg-gradient-to-r from-purple-500 to-blue-500" />
                <span className="font-medium">UPI</span>
              </div>
              <Badge variant="outline" className="w-fit text-xs">
                Instant
              </Badge>
            </div>
          </Label>

          {/* NET BANKING */}
          <Label
            htmlFor="netbanking"
            className="flex items-start sm:items-center gap-3 p-4 rounded-xl border border-gray-200/50 cursor-pointer
                       hover:border-gray-300 transition"
          >
            <RadioGroupItem
              value="netbanking"
              id="netbanking"
              className="mt-1 sm:mt-0"
            />
            <div className="flex-1 flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-gradient-to-r from-green-500 to-emerald-500" />
              <span className="font-medium">Net Banking</span>
            </div>
          </Label>
        </RadioGroup>

        {/* CARD DETAILS */}
        {paymentMethod === "card" && (
          <div className="space-y-4 p-4 rounded-xl border border-gray-200/50 bg-white/40">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700">Card Number</Label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardNumber: e.target.value,
                    })
                  }
                  placeholder="1234 5678 9012 3456"
                  className="bg-white/70"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Cardholder Name</Label>
                <Input
                  value={formData.cardName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardName: e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="bg-white/70"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-gray-700">Expiry</Label>
                <Input
                  value={formData.cardExpiry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardExpiry: e.target.value,
                    })
                  }
                  placeholder="MM/YY"
                  className="bg-white/70"
                />
              </div>

              <div className="space-y-2 sm:col-span-1">
                <Label className="text-gray-700">CVC</Label>
                <Input
                  value={formData.cardCvc}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardCvc: e.target.value,
                    })
                  }
                  placeholder="123"
                  className="bg-white/70"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
