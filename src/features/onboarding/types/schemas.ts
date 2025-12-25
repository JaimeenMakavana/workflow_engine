import { z } from "zod";

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\-\+\(\)]+$/, "Phone number contains invalid characters"),
  country: z.string().min(1, "Country is required"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Step 2: Professional Details
export const professionalDetailsSchema = z.object({
  yearsOfExperience: z
    .number({
      message: "Years of experience must be a number",
    })
    .min(0, "Years of experience cannot be negative")
    .max(50, "Years of experience cannot exceed 50"),
  skills: z
    .array(z.string())
    .min(1, "Please select at least one skill")
    .max(20, "Please select no more than 20 skills"),
  currentRole: z
    .string()
    .min(2, "Current role must be at least 2 characters")
    .max(100, "Current role must not exceed 100 characters"),
  noticePeriod: z.string().min(1, "Notice period is required"),
});

export type ProfessionalDetailsFormData = z.infer<
  typeof professionalDetailsSchema
>;

// Step 3: Documents
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const documentsSchema = z.object({
  resume: z
    .instanceof(File, { message: "Resume is required" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Resume file size must be less than 5MB"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Resume must be a PDF file"
    ),
  coverLetter: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Cover letter file size must be less than 5MB"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Cover letter must be a PDF file"
    )
    .optional()
    .nullable(),
});

export type DocumentsFormData = z.infer<typeof documentsSchema>;

// Complete application schema (for final validation)
export const completeApplicationSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalDetails: professionalDetailsSchema,
  documents: documentsSchema,
});

export type CompleteApplicationData = z.infer<typeof completeApplicationSchema>;

