"use client";

import { type LucideIcon, Flame, Leaf, MilkOff, Nut, Sprout, WheatOff } from "lucide-react";

import { cn } from "@/src/lib/cn";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

type DishBadgeVariant = "vegan" | "vegetarian" | "glutenFree" | "spicy" | "nut" | "lactoseFree";

type BadgeDefinition = {
  icon: LucideIcon;
  className: string;
};

const BADGE_DEFINITIONS: Record<DishBadgeVariant, BadgeDefinition> = {
  vegan: {
    icon: Leaf,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 data-[state=hover]:border-emerald-300",
  },
  vegetarian: {
    icon: Sprout,
    className:
      "border-lime-200 bg-lime-50 text-lime-700 data-[state=hover]:border-lime-300",
  },
  glutenFree: {
    icon: WheatOff,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 data-[state=hover]:border-amber-300",
  },
  spicy: {
    icon: Flame,
    className: "border-red-200 bg-red-50 text-red-700 data-[state=hover]:border-red-300",
  },
  nut: {
    icon: Nut,
    className:
      "border-orange-200 bg-orange-50 text-orange-700 data-[state=hover]:border-orange-300",
  },
  lactoseFree: {
    icon: MilkOff,
    className: "border-sky-200 bg-sky-50 text-sky-700 data-[state=hover]:border-sky-300",
  },
};

export type DishBadgeProps = {
  variant: DishBadgeVariant;
  className?: string;
};

export function DishBadge({ variant, className }: DishBadgeProps) {
  const dict = useScopedI18n("menus");
  const badge = BADGE_DEFINITIONS[variant];
  const labels = dict.badges?.labels as Record<string, string> | undefined;
  const label = labels?.[variant] ?? variant;
  const prefix = dict.badges?.ariaPrefix ?? "";
  const ariaLabel = prefix ? `${prefix} ${label}` : label;
  const Icon = badge.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        badge.className,
        className
      )}
      role="status"
      aria-label={ariaLabel}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span>{label}</span>
    </span>
  );
}

export type { DishBadgeVariant };
