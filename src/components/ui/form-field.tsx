"use client";

import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string | React.ReactNode;
  required?: boolean;
  error?: string;
  htmlFor: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required = false,
  error,
  htmlFor,
  helpText,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1">
        {typeof label === "string" ? (
          <>
            {label} {required && <span className="text-red-500">*</span>}
          </>
        ) : (
          label
        )}
      </Label>
      {children}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={`${htmlFor}-help`}>
          {helpText}
        </p>
      )}
      {error && (
        <p
          id={`${htmlFor}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export interface FormInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  error?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error
            ? `${props.id}-error`
            : props["aria-describedby"] || undefined
        }
        {...props}
      />
    );
  }
);
FormInput.displayName = "FormInput";

