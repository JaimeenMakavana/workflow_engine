"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const SelectField = React.forwardRef<
  HTMLSelectElement,
  SelectFieldProps
>(({ error, className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-500 focus-visible:ring-red-500",
        className
      )}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={
        error ? `${props.id}-error` : props["aria-describedby"] || undefined
      }
      {...props}
    >
      {children}
    </select>
  );
});
SelectField.displayName = "SelectField";

