"use client";

import * as React from "react";
import { cn } from "@/src/lib/cn";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helpText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helpText, error, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <div className="field">
        {label ? (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        ) : null}
        <select
          id={selectId}
          ref={ref}
          className={cn("input", className)}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="form-error">{error}</p>
        ) : helpText ? (
          <p className="form-help">{helpText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
