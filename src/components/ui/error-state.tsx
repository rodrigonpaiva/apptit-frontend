"use client";

import { TriangleAlert } from "lucide-react";
import { cn } from "@/src/lib/cn";

export type ErrorStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function ErrorState({ title, description, action, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-900",
        className
      )}
    >
      <TriangleAlert className="h-6 w-6" aria-hidden />
      <div className="space-y-1">
        <p className="text-base font-semibold">{title}</p>
        {description ? <p className="text-sm text-red-800">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
