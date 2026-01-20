import { Progress } from "@/components/ui/progress";

export function ProgressSteps({ currentStep = 2 }) {
  const steps = [
    { number: 1, label: "Cart" },
    { number: 2, label: "Details" },
    { number: 3, label: "Payment" },
  ];

  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-md space-y-4">
      <Progress
        value={progressValue}
        className="h-2 rounded-full bg-muted"
      />

      <div className="flex items-center justify-between">
        {steps.map((step) => {
          const isCompleted = step.number <= currentStep;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center gap-2"
            >
              {/* Step Dot */}
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${
                    isCompleted
                      ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
                      : "bg-background border border-gray-300 text-gray-400"
                  }
                `}
              >
                {step.number}
              </div>
              <span
                className={`text-xs transition-colors
                  ${
                    isCompleted
                      ? "text-gray-900 font-medium"
                      : "text-gray-400"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
