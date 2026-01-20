// components/product/trust-badges.js
import { Shield, Truck, RotateCcw } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over ₹999"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "256-bit SSL encryption"
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Hassle-free returns"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="flex items-center gap-3 text-sm text-gray-600 p-3 rounded-xl bg-gradient-to-br from-gray-50/30 to-white/30 backdrop-blur-sm border border-gray-200/30"
        >
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
            <badge.icon className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{badge.title}</p>
            <p className="text-xs text-gray-500">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}