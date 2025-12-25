// Public API for the onboarding feature
export { WorkflowContainer } from "./components/workflow-container";
export { Step1PersonalInfo } from "./components/step-1-personal-info";
export { Step2ProfessionalDetails } from "./components/step-2-professional-details";
export { Step3Documents } from "./components/step-3-documents";
export { Step4ReviewSubmit } from "./components/step-4-review-submit";
export { useStepNavigation } from "./hooks/use-step-navigation";
export { submitApplication, submitWithRetry } from "./api/submission";
export type { SubmissionResult } from "./api/submission";
export * from "./types/application";
export * from "./types/schemas";

