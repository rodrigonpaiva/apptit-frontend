"use client";

import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/ui/empty-state";
import { cn } from "@/src/lib/cn";

type MenusPlaceholderSectionProps = {
  id: string;
  heading: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  actionLabel: string;
  className?: string;
};

export function MenusPlaceholderSection({
  id,
  heading,
  description,
  emptyTitle,
  emptyDescription,
  actionLabel,
  className,
}: MenusPlaceholderSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("space-y-6", className)}
    >
      <div className="space-y-2">
        <h2 id={`${id}-heading`} className="text-2xl font-semibold text-[var(--text-primary)]">
          {heading}
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>

      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Button type="button" variant="secondary">
            {actionLabel}
          </Button>
        }
        className="border-[color-mix(in_oklab,var(--border-default)_80%,transparent)]"
      />
    </section>
  );
}
