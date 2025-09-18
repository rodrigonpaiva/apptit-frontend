"use client";
import * as React from "react";
import { cn } from "@/src/lib/cn";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    return (
      <label htmlFor={fieldId} className="flex items-center gap-2 cursor-pointer">
        <input id={fieldId} ref={ref} type="checkbox" className={cn("checkbox", className)} {...props} />
        {label && <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
