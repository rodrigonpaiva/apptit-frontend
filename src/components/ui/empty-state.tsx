"use client";

import { cn } from "@/src/lib/cn";

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border-default)] bg-[color-mix(in_oklab,var(--surface-raised)_85%,transparent)] px-6 py-12 text-center",
        className
      )}
    >
      {icon ? <div className="text-[var(--text-secondary)]">{icon}</div> : null}
      <div className="space-y-1">
        <p className="text-base font-semibold text-[var(--text-primary)]">{title}</p>
        {description ? (
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
