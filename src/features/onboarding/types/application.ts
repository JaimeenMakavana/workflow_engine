export type ApplicationStep = 1 | 2 | 3 | 4;

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  country: string;
}

export interface ProfessionalDetails {
  yearsOfExperience: number;
  skills: string[];
  currentRole: string;
  noticePeriod: string;
}

export interface Documents {
  resume: File | null;
  coverLetter: File | null;
}

export interface ApplicationData {
  personalInfo: PersonalInfo | null;
  professionalDetails: ProfessionalDetails | null;
  documents: Documents | null;
}

export interface StepCompletion {
  step1: boolean;
  step2: boolean;
  step3: boolean;
}

export interface ApplicationState {
  data: ApplicationData;
  currentStep: ApplicationStep;
  completion: StepCompletion;
  isSubmitting: boolean;
  submitError: string | null;
  lastSaved: number | null;
}

