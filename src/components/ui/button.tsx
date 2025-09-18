"use client";
import * as React from "react";
import { cn } from "@/src/lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const base = "btn";
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      tertiary: "btn-tertiary",
      ghost: "btn-ghost",
    } as const;
    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...props} />
    );
  }
);
Button.displayName = "Button";