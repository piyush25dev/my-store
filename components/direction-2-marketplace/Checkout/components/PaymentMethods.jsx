"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Lock,
  CreditCard,
  Wallet,
  Smartphone,
  Banknote,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export default function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
  formData,
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [upiId, setUpiId] = useState("");

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                3
              </span>
            </div>
            <h3 className="font-semibold">
              Payment Method
            </h3>
          </div>

          <Badge variant="outline" className="gap-1 w-fit">
            <Lock className="w-3 h-3" />
            Secure & Encrypted
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Tabs */}
        <Tabs defaultValue="cards" className="w-full">
          <TabsList
            className="
              w-full
              flex md:grid
              md:grid-cols-4
              gap-1
              p-2
              md:px-0
              h-auto
              flex-wrap
            "
          >
            <TabsTrigger
              value="cards"
              className="flex-shrink-0 gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Cards
            </TabsTrigger>
            <TabsTrigger
              value="upi"
              className="flex-shrink-0 gap-2"
            >
              <Smartphone className="w-4 h-4" />
              UPI
            </TabsTrigger>
            <TabsTrigger
              value="netbanking"
              className="flex-shrink-0 gap-2"
            >
              <Banknote className="w-4 h-4" />
              Net Banking
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="flex-shrink-0 gap-2"
            >
              <Wallet className="w-4 h-4" />
              Wallets
            </TabsTrigger>
          </TabsList>

          {/* Payment Options */}
          <div className="pt-6">
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              {[
                {
                  id: "credit-card",
                  label: "Credit / Debit Card",
                  desc: "VISA, MasterCard, RuPay",
                  icon: <CreditCard className="w-6 h-6 text-gray-400" />,
                },
                {
                  id: "paypal",
                  label: "PayPal",
                  desc: "Pay securely with PayPal",
                  icon: (
                    <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center text-xs font-bold">
                      PP
                    </div>
                  ),
                },
                {
                  id: "google-pay",
                  label: "Google Pay",
                  desc: "Fast & secure payments",
                  icon: (
                    <div className="w-8 h-8 border rounded flex items-center justify-center text-xs">
                      G Pay
                    </div>
                  ),
                },
              ].map((m) => (
                <label
                  key={m.id}
                  htmlFor={m.id}
                  className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={m.id} id={m.id} />
                    <div>
                      <div className="font-medium">
                        {m.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {m.desc}
                      </div>
                    </div>
                  </div>
                  {m.icon}
                </label>
              ))}
            </RadioGroup>
          </div>
        </Tabs>

        {/* Card Form */}
        {paymentMethod === "credit-card" && (
          <div className="space-y-4 border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  className="font-mono"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Name on Card</Label>
                <Input
                  placeholder={formData.name || "John Doe"}
                  value={cardName}
                  onChange={(e) =>
                    setCardName(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) =>
                  setExpiry(e.target.value)
                }
              />
              <Input
                placeholder="CVV"
                type="password"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value)
                }
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={saveCard}
                  onCheckedChange={setSaveCard}
                />
                <Label className="text-sm">
                  Save card securely
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* UPI */}
        {paymentMethod === "upi" && (
          <div className="space-y-4 border-t pt-6">
            <Input
              placeholder="username@upi"
              className="font-mono"
              value={upiId}
              onChange={(e) =>
                setUpiId(e.target.value)
              }
            />
            <Button
              variant="outline"
              className="w-full gap-2"
            >
              <QrCode className="w-4 h-4" />
              Show QR Code
            </Button>
          </div>
        )}

        {/* Security */}
        <Alert className="bg-green-50 border-green-200 flex gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5" />
          <div>
            <AlertTitle className="text-green-700">
              Payment Security
            </AlertTitle>
            <AlertDescription className="text-sm text-green-600">
              All transactions are secured with 256-bit SSL
              encryption. We never store payment details.
            </AlertDescription>
          </div>
        </Alert>
      </CardContent>
    </Card>
  );
}
