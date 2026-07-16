import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "State" },
  { id: 2, label: "Landlord" },
  { id: 3, label: "Tenant" },
  { id: 4, label: "Property" },
  { id: 5, label: "Rent Terms" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  currentStep > step.id
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : currentStep === step.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-400"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "mt-2 hidden text-xs font-medium sm:block",
                  currentStep >= step.id ? "text-emerald-700" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 transition-colors",
                  currentStep > step.id ? "bg-emerald-600" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}