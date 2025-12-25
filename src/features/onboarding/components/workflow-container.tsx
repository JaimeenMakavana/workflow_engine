"use client";

import { useStepNavigation } from "../hooks/use-step-navigation";
import { Step1PersonalInfo } from "./step-1-personal-info";
import { Step2ProfessionalDetails } from "./step-2-professional-details";
import { Step3Documents } from "./step-3-documents";
import { Step4ReviewSubmit } from "./step-4-review-submit";
import { useApplicationStore } from "@/lib/store/application-store";

const STEP_TITLES = [
  "Personal Information",
  "Professional Details",
  "Documents",
  "Review & Submit",
];

export function WorkflowContainer() {
  const { currentStep } = useStepNavigation();
  const { completion } = useApplicationStore();

  const getStepStatus = (
    step: number
  ): "completed" | "current" | "pending" => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "pending";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
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
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
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

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {STEP_TITLES[currentStep - 1]}
        </h1>

        <div
          role="region"
          aria-live="polite"
          aria-label={`Step ${currentStep} of 4`}
        >
          {currentStep === 1 && <Step1PersonalInfo />}
          {currentStep === 2 && <Step2ProfessionalDetails />}
          {currentStep === 3 && <Step3Documents />}
          {currentStep === 4 && <Step4ReviewSubmit />}
        </div>
      </div>
    </div>
  );
}

