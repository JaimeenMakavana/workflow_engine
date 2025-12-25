"use client";

import { useStepNavigation } from "../hooks/use-step-navigation";
import { Step1PersonalInfo } from "./step-1-personal-info";
import { Step2ProfessionalDetails } from "./step-2-professional-details";
import { Step3Documents } from "./step-3-documents";
import { Step4ReviewSubmit } from "./step-4-review-submit";
import { useApplicationStore } from "@/lib/store/application-store";
import { ProgressIndicator } from "./progress-indicator";

const STEP_TITLES = [
  "Personal Information",
  "Professional Details",
  "Documents",
  "Review & Submit",
];

export function WorkflowContainer() {
  const { currentStep } = useStepNavigation();
  const { completion } = useApplicationStore();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressIndicator currentStep={currentStep} completion={completion} />

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
