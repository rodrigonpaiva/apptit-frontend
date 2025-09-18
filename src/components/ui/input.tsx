"use client";
import * as React from "react";
import { cn } from "@/src/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helpText, error, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="field">
        {label && <label htmlFor={inputId} className="form-label">{label}</label>}
        <input id={inputId} ref={ref} className={cn("input", className)} aria-invalid={!!error} {...props} />
        {error ? <p className="form-error">{error}</p> : helpText ? <p className="form-help">{helpText}</p> : null}
      </div>
    );
  }
);
Input.displayName = "Input";