"use client";

import { Check } from "lucide-react";
import { useApplicationStore } from "@/lib/store/application-store";
import { useStepNavigation } from "../hooks/use-step-navigation";
import { submitWithRetry } from "../api/submission";
import { completeApplicationSchema } from "../types/schemas";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Step4ReviewSubmit() {
  const {
    data,
    isSubmitting,
    submitError,
    setSubmitting,
    setSubmitError,
    reset,
  } = useApplicationStore();
  const { goToStep } = useStepNavigation();
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validate all steps before allowing submission
  useEffect(() => {
    const result = completeApplicationSchema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
    }
  }, [data]);

  const canSubmit =
    data.personalInfo &&
    data.professionalDetails &&
    data.documents?.resume &&
    Object.keys(validationErrors).length === 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const result = completeApplicationSchema.safeParse(data);
    if (!result.success) {
      setSubmitError("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setValidationErrors({});

    try {
      const submissionResult = await submitWithRetry(result.data);

      if (submissionResult.success) {
        setSubmitSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          reset();
          router.push("/onboarding?step=1");
        }, 3000);
      } else {
        if (submissionResult.validationErrors) {
          setValidationErrors(submissionResult.validationErrors);
        }
        setSubmitError(
          submissionResult.error || "Failed to submit application"
        );
      }
    } catch (error) {
      setSubmitError(
        (error as Error).message || "An unexpected error occurred"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="w-8 h-8 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Application Submitted!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your application. We'll review it and get back to you
          soon.
        </p>
        <p className="text-sm text-gray-500">Redirecting to start...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Information Review */}
      <section aria-labelledby="personal-info-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="personal-info-heading"
            className="text-lg font-semibold text-gray-900"
          >
            Personal Information
          </h2>
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Edit
          </button>
        </div>
        {data.personalInfo ? (
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <p>
              <strong>Name:</strong> {data.personalInfo.fullName}
            </p>
            <p>
              <strong>Email:</strong> {data.personalInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {data.personalInfo.phone}
            </p>
            <p>
              <strong>Country:</strong> {data.personalInfo.country}
            </p>
          </div>
        ) : (
          <p className="text-red-600">Personal information not completed</p>
        )}
      </section>

      {/* Professional Details Review */}
      <section aria-labelledby="professional-details-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="professional-details-heading"
            className="text-lg font-semibold text-gray-900"
          >
            Professional Details
          </h2>
          <button
            type="button"
            onClick={() => goToStep(2)}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Edit
          </button>
        </div>
        {data.professionalDetails ? (
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <p>
              <strong>Years of Experience:</strong>{" "}
              {data.professionalDetails.yearsOfExperience}
            </p>
            <p>
              <strong>Skills:</strong>{" "}
              {data.professionalDetails.skills.join(", ")}
            </p>
            <p>
              <strong>Current Role:</strong>{" "}
              {data.professionalDetails.currentRole}
            </p>
            <p>
              <strong>Notice Period:</strong>{" "}
              {data.professionalDetails.noticePeriod}
            </p>
          </div>
        ) : (
          <p className="text-red-600">Professional details not completed</p>
        )}
      </section>

      {/* Documents Review */}
      <section aria-labelledby="documents-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="documents-heading"
            className="text-lg font-semibold text-gray-900"
          >
            Documents
          </h2>
          <button
            type="button"
            onClick={() => goToStep(3)}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Edit
          </button>
        </div>
        {data.documents ? (
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <p>
              <strong>Resume:</strong>{" "}
              {data.documents.resume ? (
                <span>
                  {data.documents.resume.name} (
                  {formatFileSize(data.documents.resume.size)})
                </span>
              ) : (
                <span className="text-red-600">Not uploaded</span>
              )}
            </p>
            {data.documents.coverLetter && (
              <p>
                <strong>Cover Letter:</strong> {data.documents.coverLetter.name}{" "}
                ({formatFileSize(data.documents.coverLetter.size)})
              </p>
            )}
          </div>
        ) : (
          <p className="text-red-600">Documents not uploaded</p>
        )}
      </section>

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <h3 className="font-semibold text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
            {Object.entries(validationErrors).map(([field, errors]) => (
              <li key={field}>
                <strong>{field}:</strong> {errors.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submission Error */}
      {submitError && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => goToStep(3)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !canSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}
