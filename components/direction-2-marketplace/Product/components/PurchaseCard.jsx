"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart,
  Shield,
  Download,
  RotateCcw,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function PurchaseCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]?.id
  );
  const [addons, setAddons] = useState({
    support: false,
    tutorials: false,
  });

  const handleAddonToggle = (addon) => {
    setAddons((prev) => ({ ...prev, [addon]: !prev[addon] }));
  };

  const totalPrice =
    product.price + (addons.support ? 299 : 0) + (addons.tutorials ? 499 : 0);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <h3 className="font-semibold">Purchase Options</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}

        {/* Add-ons */}
        <AddonSelector addons={addons} onToggle={handleAddonToggle} />

        {/* Stock Status */}
        <StockStatus inStock={product.inStock} />

        {/* Total & Actions */}
        <div className="space-y-3 flex flex-col gap-3">
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold">₹{totalPrice}</span>
          </div>

          <Button size="lg" className="w-full" disabled={!product.inStock}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart • ₹{totalPrice}
          </Button>

          {product.inStock ? (
            <Link
              href={`/mockups/direction-2-marketplace/checkout?product=${product.id}`}
              className="w-full"
            >
              <Button size="lg" variant="outline" className="w-full">
                Buy Now
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-full cursor-not-allowed opacity-50"
              disabled
            >
              Out of Stock
            </Button>
          )}
        </div>

        {/* Trust Badges */}
        <TrustBadges />
      </CardContent>
    </Card>
  );
}

// Sub-components
function VariantSelector({ variants, selected, onSelect }) {
  return (
    <div className="space-y-3">
      <p className="font-medium">Select Version</p>
      <div className="space-y-2">
        {variants.map((variant) => (
          <label
            key={variant.id}
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
              selected === variant.id
                ? "border-blue-500 bg-blue-50"
                : "hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="variant"
                checked={selected === variant.id}
                onChange={() => onSelect(variant.id)}
                className="text-blue-500"
              />
              <div>
                <p className="font-medium">{variant.label}</p>
                <p className="text-sm text-gray-500">Most popular</p>
              </div>
            </div>
            <span className="font-bold">₹1299</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AddonSelector({ addons, onToggle }) {
  const addonOptions = [
    {
      id: "support",
      label: "Extended Support",
      description: "+6 months support",
      price: 299,
    },
    {
      id: "tutorials",
      label: "Video Tutorials",
      description: "+5 tutorial videos",
      price: 499,
    },
  ];

  return (
    <div className="space-y-3">
      <p className="font-medium">Add-ons (Optional)</p>
      <div className="space-y-2">
        {addonOptions.map((addon) => (
          <label
            key={addon.id}
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-gray-400"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={addons[addon.id]}
                onChange={() => onToggle(addon.id)}
                className="rounded"
              />
              <div>
                <p className="font-medium">{addon.label}</p>
                <p className="text-sm text-gray-500">{addon.description}</p>
              </div>
            </div>
            <span className="font-bold">₹{addon.price}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StockStatus({ inStock }) {
  if (!inStock) {
    return (
      <Alert className="bg-red-50">
        <AlertDescription className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Restocking soon - Join waitlist</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-green-50 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">In stock</span>
        <span className="text-sm text-gray-600">Only 12 left</span>
      </div>
      <Progress value={30} className="h-1" />
    </div>
  );
}

function TrustBadges() {
  const badges = [
    { icon: <Shield className="w-6 h-6" />, label: "Secure Payment" },
    { icon: <Download className="w-6 h-6" />, label: "Instant Download" },
    { icon: <RotateCcw className="w-6 h-6" />, label: "30-Day Returns" },
    { icon: <Users className="w-6 h-6" />, label: "Support 24/7" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 pt-4 border-t">
      {badges.map((badge, idx) => (
        <div key={idx} className="text-center p-2 flex flex-col items-center">
          <div className="mx-auto text-gray-400 mb-1">{badge.icon}</div>
          <p className="text-xs text-gray-600">{badge.label}</p>
        </div>
      ))}
    </div>
  );
}
