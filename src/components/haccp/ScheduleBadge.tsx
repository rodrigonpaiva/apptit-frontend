"use client";

import { Clock } from "lucide-react";
import { cn } from "@/src/lib/cn";

export type ScheduleBadgeProps = {
  nextAt: string;
  label?: string;
  className?: string;
};

export function ScheduleBadge({ nextAt, label, className }: ScheduleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-raised)] px-3 py-1 text-sm font-medium text-[var(--text-primary)] shadow-smx",
        className
      )}
    >
      <Clock className="h-4 w-4 text-[var(--brand-primary)]" aria-hidden />
      <span>{label ?? "Next control"}</span>
      <span className="font-semibold text-[var(--brand-primary)]">{nextAt}</span>
    </span>
  );
}
