"use client";
import * as React from "react";
import { cn } from "@/src/lib/cn";

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "warning" | "error" | "info";
  title?: string;
};

export function Alert({ className, title, children, variant = "default", ...props }: AlertProps) {
  const variants = {
    default: "alert",
    success: "alert alert-success",
    warning: "alert alert-warning",
    error: "alert alert-error",
    info: "alert alert-info",
  } as const;

  return (
    <div className={cn(variants[variant], className)} role="status" {...props}>
      <div>
        {title && <p className="alert-title">{title}</p>}
        {children && <p className="alert-desc">{children}</p>}
      </div>
    </div>
  );
}