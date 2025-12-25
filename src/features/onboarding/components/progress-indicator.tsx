"use client";

import { Check } from "lucide-react";
import type { StepCompletion } from "../types/application";

const STEP_TITLES = [
  "Personal Information",
  "Professional Details",
  "Documents",
  "Review & Submit",
];

interface ProgressIndicatorProps {
  currentStep: number;
  completion: StepCompletion;
}

export function ProgressIndicator({
  currentStep,
  completion,
}: ProgressIndicatorProps) {
  const getStepStatus = (step: number): "completed" | "current" | "pending" => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "pending";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {STEP_TITLES.map((title, index) => {
          const step = index + 1;
          const status = getStepStatus(step);
          const isCompleted =
            completion[`step${step}` as keyof typeof completion];

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    status === "current"
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : status === "completed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  aria-current={status === "current" ? "step" : undefined}
                >
                  {isCompleted && status !== "current" ? (
                    <Check className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    status === "current" ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {title}
                </span>
              </div>
              {index < STEP_TITLES.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? "bg-green-600" : "bg-gray-200"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
