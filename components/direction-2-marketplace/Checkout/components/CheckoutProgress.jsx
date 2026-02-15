// components/CheckoutProgress.jsx

import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CheckoutProgress({ currentStep = 1 }) {
  const steps = [
    { id: 1, label: "Cart", status: "completed" },
    { id: 2, label: "Checkout", status: currentStep === 2 ? "current" : "upcoming" },
    { id: 3, label: "Confirmation", status: "upcoming" },
  ];

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Shadcn UI Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Checkout Progress</span>
          <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Current Step Description */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          {currentStep === 1 && "Review your cart items"}
          {currentStep === 2 && "Enter your shipping and payment details"}
          {currentStep === 3 && "Confirm your order and complete purchase"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Step {currentStep} of {steps.length}
        </p>
      </div>
    </div>
  );
}