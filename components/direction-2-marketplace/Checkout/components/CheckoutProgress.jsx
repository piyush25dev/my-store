// components/CheckoutProgress.jsx

import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

      {/* Step Indicators */}
      {/* <div className="relative">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="relative flex justify-between z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                step.status === "completed" 
                  ? "bg-green-500 border-green-500 text-white" 
                  : step.status === "current"
                  ? "bg-white border-blue-500 text-blue-500"
                  : "bg-white border-gray-300 text-gray-400"
              )}>
                {step.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium text-center",
                step.status === "current" ? "text-blue-500" : 
                step.status === "completed" ? "text-green-600" : "text-gray-500"
              )}>
                {step.label}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {step.status === "completed" ? "✓ Done" : 
                 step.status === "current" ? "In progress" : "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      </div> */}

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