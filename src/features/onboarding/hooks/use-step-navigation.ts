"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useApplicationStore } from "@/lib/store/application-store";
import type { ApplicationStep } from "../types/application";

export function useStepNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentStep, setCurrentStep } = useApplicationStore();

  // Sync URL with store on mount
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const step = parseInt(stepParam, 10) as ApplicationStep;
      if (step >= 1 && step <= 4 && step !== currentStep) {
        setCurrentStep(step);
      }
    } else if (currentStep !== 1) {
      // If no step param but store has a step, sync URL
      router.replace(`${pathname}?step=${currentStep}`);
    }
  }, []); // Only run on mount

  // Sync store with URL changes
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const step = parseInt(stepParam, 10) as ApplicationStep;
      if (step >= 1 && step <= 4 && step !== currentStep) {
        setCurrentStep(step);
      }
    }
  }, [searchParams, setCurrentStep]);

  const goToStep = (step: ApplicationStep) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
      router.push(`${pathname}?step=${step}`);
    }
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      goToStep((currentStep + 1) as ApplicationStep);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as ApplicationStep);
    }
  };

  return {
    currentStep,
    goToStep,
    goToNextStep,
    goToPreviousStep,
  };
}
