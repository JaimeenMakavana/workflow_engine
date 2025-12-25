"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  professionalDetailsSchema,
  type ProfessionalDetailsFormData,
} from "../types/schemas";
import { useApplicationStore } from "@/lib/store/application-store";
import { useStepNavigation } from "../hooks/use-step-navigation";
import { useEffect } from "react";

const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "CI/CD",
  "Agile",
  "Scrum",
  "UI/UX Design",
  "Project Management",
];

const NOTICE_PERIODS = [
  "Immediate",
  "1 week",
  "2 weeks",
  "1 month",
  "2 months",
  "3 months",
  "More than 3 months",
];

export function Step2ProfessionalDetails() {
  const { data, setProfessionalDetails } = useApplicationStore();
  const { goToNextStep, goToPreviousStep } = useStepNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<ProfessionalDetailsFormData>({
    resolver: zodResolver(professionalDetailsSchema),
    mode: "onChange",
    defaultValues: data.professionalDetails || {
      yearsOfExperience: 0,
      skills: [],
      currentRole: "",
      noticePeriod: "",
    },
  });

  const yearsOfExperience = watch("yearsOfExperience");
  const selectedSkills = watch("skills") || [];

  // Load existing data if available
  useEffect(() => {
    if (data.professionalDetails) {
      setValue("yearsOfExperience", data.professionalDetails.yearsOfExperience);
      setValue("skills", data.professionalDetails.skills);
      setValue("currentRole", data.professionalDetails.currentRole);
      setValue("noticePeriod", data.professionalDetails.noticePeriod);
    }
  }, [data.professionalDetails, setValue]);

  const handleSkillToggle = (skill: string) => {
    const currentSkills = selectedSkills;
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    setValue("skills", newSkills, { shouldValidate: true });
  };

  const onSubmit = (formData: ProfessionalDetailsFormData) => {
    setProfessionalDetails(formData);
    goToNextStep();
  };

  const showInternshipDisclaimer = yearsOfExperience < 1;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor="yearsOfExperience"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <input
          id="yearsOfExperience"
          type="number"
          min="0"
          max="50"
          step="0.5"
          {...register("yearsOfExperience", { valueAsNumber: true })}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.yearsOfExperience ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={errors.yearsOfExperience ? "true" : "false"}
          aria-describedby={
            errors.yearsOfExperience ? "yearsOfExperience-error" : undefined
          }
        />
        {errors.yearsOfExperience && (
          <p
            id="yearsOfExperience-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.yearsOfExperience.message}
          </p>
        )}
      </div>

      {showInternshipDisclaimer && (
        <div
          className="p-4 bg-yellow-50 border border-yellow-200 rounded-md"
          role="alert"
        >
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Since you have less than 1 year of
            experience, this position may be considered for an internship
            program.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-gray-300 rounded-md p-4 max-h-64 overflow-y-auto">
          {SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <label
                key={skill}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSkillToggle(skill)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-label={`Select ${skill}`}
                />
                <span className="text-sm text-gray-700">{skill}</span>
              </label>
            );
          })}
        </div>
        {errors.skills && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.skills.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="currentRole"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Current Role <span className="text-red-500">*</span>
        </label>
        <input
          id="currentRole"
          type="text"
          {...register("currentRole")}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.currentRole ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={errors.currentRole ? "true" : "false"}
          aria-describedby={
            errors.currentRole ? "currentRole-error" : undefined
          }
        />
        {errors.currentRole && (
          <p
            id="currentRole-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.currentRole.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="noticePeriod"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notice Period <span className="text-red-500">*</span>
        </label>
        <select
          id="noticePeriod"
          {...register("noticePeriod")}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.noticePeriod ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={errors.noticePeriod ? "true" : "false"}
          aria-describedby={
            errors.noticePeriod ? "noticePeriod-error" : undefined
          }
        >
          <option value="">Select notice period</option>
          {NOTICE_PERIODS.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
        {errors.noticePeriod && (
          <p
            id="noticePeriod-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.noticePeriod.message}
          </p>
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

