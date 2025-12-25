"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  type PersonalInfoFormData,
} from "../types/schemas";
import { useApplicationStore } from "@/lib/store/application-store";
import { useStepNavigation } from "../hooks/use-step-navigation";
import { useEffect } from "react";
import { FormField, FormInput } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Other",
];

export function Step1PersonalInfo() {
  const { data, setPersonalInfo } = useApplicationStore();
  const { goToNextStep } = useStepNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: data.personalInfo || {
      fullName: "",
      email: "",
      phone: "",
      country: "",
    },
  });

  // Load existing data if available
  useEffect(() => {
    if (data.personalInfo) {
      setValue("fullName", data.personalInfo.fullName);
      setValue("email", data.personalInfo.email);
      setValue("phone", data.personalInfo.phone);
      setValue("country", data.personalInfo.country);
    }
  }, [data.personalInfo, setValue]);

  const onSubmit = (formData: PersonalInfoFormData) => {
    setPersonalInfo(formData);
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormField
        label="Full Name"
        required
        htmlFor="fullName"
        error={errors.fullName?.message}
      >
        <FormInput
          id="fullName"
          type="text"
          {...register("fullName")}
          error={!!errors.fullName}
        />
      </FormField>

      <FormField
        label="Email"
        required
        htmlFor="email"
        error={errors.email?.message}
      >
        <FormInput
          id="email"
          type="email"
          {...register("email")}
          error={!!errors.email}
        />
      </FormField>

      <FormField
        label="Phone Number"
        required
        htmlFor="phone"
        error={errors.phone?.message}
      >
        <FormInput
          id="phone"
          type="tel"
          {...register("phone")}
          error={!!errors.phone}
        />
      </FormField>

      <FormField
        label="Country"
        required
        htmlFor="country"
        error={errors.country?.message}
      >
        <SelectField
          id="country"
          {...register("country")}
          error={!!errors.country}
        >
          <option value="">Select a country</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </SelectField>
      </FormField>

      <div className="flex justify-end pt-4">
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
