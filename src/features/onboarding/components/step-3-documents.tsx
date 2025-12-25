"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentsSchema, type DocumentsFormData } from "../types/schemas";
import { useApplicationStore } from "@/lib/store/application-store";
import { useStepNavigation } from "../hooks/use-step-navigation";
import { useEffect, useRef } from "react";

export function Step3Documents() {
  const { data, setDocuments } = useApplicationStore();
  const { goToNextStep, goToPreviousStep } = useStepNavigation();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema),
    mode: "onChange",
    defaultValues: {
      resume: undefined as any, // Will be set when file is selected
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
      setValue(
        field,
        field === "coverLetter" && !file ? null : file,
        { shouldValidate: true }
      );
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
      <div>
        <label
          htmlFor="resume"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Resume (PDF) <span className="text-red-500">*</span>
        </label>
        <input
          id="resume"
          type="file"
          accept=".pdf,application/pdf"
          ref={resumeInputRef}
          onChange={(e) => handleFileChange("resume", e)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.resume ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={errors.resume ? "true" : "false"}
          aria-describedby={
            errors.resume ? "resume-error resume-help" : "resume-help"
          }
        />
        <p id="resume-help" className="mt-1 text-sm text-gray-500">
          Maximum file size: 5MB. PDF format only.
        </p>
        {errors.resume && (
          <p
            id="resume-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.resume.message}
          </p>
        )}
        {resumeFile && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Selected: {resumeFile.name} ({formatFileSize(resumeFile.size)})
            </p>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="coverLetter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Cover Letter (PDF) <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          id="coverLetter"
          type="file"
          accept=".pdf,application/pdf"
          ref={coverLetterInputRef}
          onChange={(e) => handleFileChange("coverLetter", e)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.coverLetter ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={errors.coverLetter ? "true" : "false"}
          aria-describedby={
            errors.coverLetter
              ? "coverLetter-error coverLetter-help"
              : "coverLetter-help"
          }
        />
        <p id="coverLetter-help" className="mt-1 text-sm text-gray-500">
          Maximum file size: 5MB. PDF format only.
        </p>
        {errors.coverLetter && (
          <p
            id="coverLetter-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.coverLetter.message}
          </p>
        )}
        {coverLetterFile && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Selected: {coverLetterFile.name} (
              {formatFileSize(coverLetterFile.size)})
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Saving..." : "Next"}
        </button>
      </div>
    </form>
  );
}

