import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ApplicationData,
  ApplicationStep,
  StepCompletion,
  PersonalInfo,
  ProfessionalDetails,
  Documents,
} from "@/features/onboarding/types/application";

interface ApplicationStore {
  data: ApplicationData;
  currentStep: ApplicationStep;
  completion: StepCompletion;
  isSubmitting: boolean;
  submitError: string | null;
  lastSaved: number | null;

  // Actions
  setCurrentStep: (step: ApplicationStep) => void;
  setPersonalInfo: (data: PersonalInfo) => void;
  setProfessionalDetails: (data: ProfessionalDetails) => void;
  setDocuments: (data: Documents) => void;
  setStepCompletion: (step: ApplicationStep, completed: boolean) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitError: (error: string | null) => void;
  reset: () => void;
  getCompletionStatus: () => StepCompletion;
}

const initialState = {
  data: {
    personalInfo: null,
    professionalDetails: null,
    documents: null,
  },
  currentStep: 1 as ApplicationStep,
  completion: {
    step1: false,
    step2: false,
    step3: false,
  },
  isSubmitting: false,
  submitError: null,
  lastSaved: null,
};

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      setPersonalInfo: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: data,
          },
          lastSaved: Date.now(),
        }));
        get().setStepCompletion(1, true);
      },

      setProfessionalDetails: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            professionalDetails: data,
          },
          lastSaved: Date.now(),
        }));
        get().setStepCompletion(2, true);
      },

      setDocuments: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            documents: data,
          },
          lastSaved: Date.now(),
        }));
        get().setStepCompletion(3, true);
      },

      setStepCompletion: (step, completed) => {
        set((state) => ({
          completion: {
            ...state.completion,
            [`step${step}`]: completed,
          },
        }));
      },

      setSubmitting: (isSubmitting) => {
        set({
          isSubmitting,
          submitError: isSubmitting ? null : get().submitError,
        });
      },

      setSubmitError: (error) => {
        set({ submitError: error });
      },

      reset: () => {
        set(initialState);
      },

      getCompletionStatus: () => {
        return get().completion;
      },
    }),
    {
      name: "job-application-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Merge with initial state to ensure all fields exist
          return {
            state: {
              ...initialState,
              ...parsed.state,
            },
            version: parsed.version,
          };
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          // Only persist data, not UI state
          const toPersist = {
            state: {
              data: value.state.data,
              completion: value.state.completion,
              currentStep: value.state.currentStep,
              lastSaved: value.state.lastSaved,
            },
            version: value.version,
          };
          sessionStorage.setItem(name, JSON.stringify(toPersist));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

