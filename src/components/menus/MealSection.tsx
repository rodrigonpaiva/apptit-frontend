"use client";

import { Children, type ReactNode } from "react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

export type MealKey = "breakfast" | "lunch" | "dinner" | "snack";

export type MealSectionProps = {
  meal: MealKey;
  children?: ReactNode;
  droppableId?: string;
  onAddDish?: () => void;
  totalDishes?: number;
  className?: string;
  footer?: ReactNode;
};

export function MealSection({
  meal,
  children,
  droppableId,
  onAddDish,
  totalDishes,
  className,
  footer,
}: MealSectionProps) {
  const dict = useScopedI18n("menus");
  const labels = dict.meals?.labels as Record<string, string> | undefined;
  const label = labels?.[meal] ?? meal;
  const emptyLabel = dict.meals?.empty ?? "";
  const dragHint = dict.meals?.dragHint ?? "";
  const addDishLabel = dict.meals?.addDish ?? "";
  const hasChildren = Children.count(children) > 0;

  return (
    <section
      aria-labelledby={`meal-${meal}-heading`}
      className={cn("space-y-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4", className)}
      data-meal-section
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h3 id={`meal-${meal}-heading`} className="text-base font-semibold text-[var(--text-primary)]">
            {label}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">{dragHint}</p>
        </div>
        <div className="flex items-center gap-2">
          {typeof totalDishes === "number" ? (
            <span className="rounded-full bg-[var(--surface-default)] px-3 py-1 text-xs text-[var(--text-secondary)]">
              {totalDishes}
            </span>
          ) : null}
          {onAddDish ? (
            <Button type="button" variant="ghost" onClick={onAddDish} aria-label={`${addDishLabel} - ${label}`}>
              {addDishLabel}
            </Button>
          ) : null}
        </div>
      </header>

      <div
        className="space-y-2 rounded-xl border border-dashed border-[var(--border-default)] bg-white p-3"
        role="list"
        aria-describedby={`meal-${meal}-instructions`}
        data-droppable-id={droppableId}
      >
        <p id={`meal-${meal}-instructions`} className="sr-only">
          {dragHint}
        </p>
        {hasChildren ? children : (
          <p className="text-xs text-[var(--text-secondary)]">{emptyLabel}</p>
        )}
      </div>
      {footer ? <div className="mt-2 text-xs text-[var(--text-secondary)]">{footer}</div> : null}
    </section>
  );
}
