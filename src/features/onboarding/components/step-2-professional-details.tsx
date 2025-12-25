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
import { FormField, FormInput } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
      <FormField
        label="Years of Experience"
        required
        htmlFor="yearsOfExperience"
        error={errors.yearsOfExperience?.message}
      >
        <FormInput
          id="yearsOfExperience"
          type="number"
          min="0"
          max="50"
          step="0.5"
          {...register("yearsOfExperience", { valueAsNumber: true })}
          error={!!errors.yearsOfExperience}
        />
      </FormField>

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
        <Label className="mb-2">
          Skills <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-input rounded-md p-4 max-h-64 overflow-y-auto">
          {SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <label
                key={skill}
                className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSkillToggle(skill)}
                  className="w-4 h-4 text-primary border-input rounded focus:ring-ring"
                  aria-label={`Select ${skill}`}
                />
                <span className="text-sm">{skill}</span>
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

      <FormField
        label="Current Role"
        required
        htmlFor="currentRole"
        error={errors.currentRole?.message}
      >
        <FormInput
          id="currentRole"
          type="text"
          {...register("currentRole")}
          error={!!errors.currentRole}
        />
      </FormField>

      <FormField
        label="Notice Period"
        required
        htmlFor="noticePeriod"
        error={errors.noticePeriod?.message}
      >
        <SelectField
          id="noticePeriod"
          {...register("noticePeriod")}
          error={!!errors.noticePeriod}
        >
          <option value="">Select notice period</option>
          {NOTICE_PERIODS.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </SelectField>
      </FormField>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
        >
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

