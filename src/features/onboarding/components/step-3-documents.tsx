"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentsSchema, type DocumentsFormData } from "../types/schemas";
import { useApplicationStore } from "@/lib/store/application-store";
import { useStepNavigation } from "../hooks/use-step-navigation";
import { useEffect, useRef } from "react";
import { FormField, FormInput } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

export function Step3Documents() {
  const { data, setDocuments } = useApplicationStore();
  const { goToNextStep, goToPreviousStep } = useStepNavigation();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
    clearErrors,
  } = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema),
    mode: "onChange",
    defaultValues: {
      resume: undefined as File | undefined, // Will be set when file is selected
      coverLetter: null,
    },
  });

  const resumeFile = watch("resume");
  const coverLetterFile = watch("coverLetter");

  // Load existing file names if available (files can't be stored in sessionStorage)
  useEffect(() => {
    if (data.documents?.resume) {
      // File objects can't be persisted, so we just show the name if it exists
      // In a real app, you'd handle file persistence differently
    }
  }, [data.documents]);

  const handleFileChange = (
    field: "resume" | "coverLetter",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      clearErrors(field);
      setValue(field, field === "coverLetter" && !file ? null : file, {
        shouldValidate: true,
      });
    } else if (field === "coverLetter") {
      setValue(field, null, { shouldValidate: true });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const onSubmit = (formData: DocumentsFormData) => {
    setDocuments({
      resume: formData.resume,
      coverLetter: formData.coverLetter || null,
    });
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormField
        label="Resume (PDF)"
        required
        htmlFor="resume"
        error={errors.resume?.message}
        helpText="Maximum file size: 5MB. PDF format only."
      >
        <FormInput
          id="resume"
          type="file"
          accept=".pdf,application/pdf"
          ref={resumeInputRef}
          onChange={(e) => handleFileChange("resume", e)}
          error={!!errors.resume}
          aria-describedby={
            errors.resume ? "resume-error resume-help" : "resume-help"
          }
        />
        {resumeFile && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Selected: {resumeFile.name} ({formatFileSize(resumeFile.size)})
            </p>
          </div>
        )}
      </FormField>

      <FormField
        label={
          <>
            Cover Letter (PDF){" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </>
        }
        htmlFor="coverLetter"
        error={errors.coverLetter?.message}
        helpText="Maximum file size: 5MB. PDF format only."
      >
        <FormInput
          id="coverLetter"
          type="file"
          accept=".pdf,application/pdf"
          ref={coverLetterInputRef}
          onChange={(e) => handleFileChange("coverLetter", e)}
          error={!!errors.coverLetter}
          aria-describedby={
            errors.coverLetter
              ? "coverLetter-error coverLetter-help"
              : "coverLetter-help"
          }
        />
        {coverLetterFile && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Selected: {coverLetterFile.name} (
              {formatFileSize(coverLetterFile.size)})
            </p>
          </div>
        )}
      </FormField>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Previous
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          aria-disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Saving..." : "Next"}
        </Button>
      </div>
    </form>
  );
}
