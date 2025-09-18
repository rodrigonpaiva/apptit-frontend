"use client";

import { cn } from "@/src/lib/cn";
import { type AllergenCode } from "@/src/lib/i18n";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import type { LucideIcon } from "lucide-react";
import {
  Egg,
  Fish,
  Leaf,
  Milk,
  Nut,
  Shell,
  Skull,
  Sprout,
  Wheat,
} from "lucide-react";

const styles: Record<AllergenCode, { icon: LucideIcon; className: string }> = {
  gluten: {
    icon: Wheat,
    className: "border-yellow-200 bg-yellow-50 text-yellow-900",
  },
  lactose: {
    icon: Milk,
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
  nuts: {
    icon: Nut,
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  shellfish: {
    icon: Shell,
    className: "border-sky-200 bg-sky-50 text-sky-900",
  },
  soy: {
    icon: Sprout,
    className: "border-lime-200 bg-lime-50 text-lime-800",
  },
  egg: {
    icon: Egg,
    className: "border-orange-200 bg-orange-50 text-orange-900",
  },
  fish: {
    icon: Fish,
    className: "border-cyan-200 bg-cyan-50 text-cyan-900",
  },
  vegan: {
    icon: Leaf,
    className: "border-green-200 bg-green-50 text-green-800",
  },
  poison: {
    icon: Skull,
    className: "border-red-200 bg-red-50 text-red-800",
  },
};

export type BadgeAllergenProps = {
  code: AllergenCode;
  className?: string;
  showLabel?: boolean;
  ariaLabel?: string;
};

export function BadgeAllergen({
  code,
  className,
  showLabel = true,
  ariaLabel,
}: BadgeAllergenProps) {
  const allergensDict = useScopedI18n("allergens");
  const config = styles[code];
  const label = allergensDict[code] ?? code;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight",
        config.className,
        showLabel ? "pr-3" : "pr-2",
        className
      )}
      aria-label={ariaLabel ?? label}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {showLabel ? <span>{label}</span> : null}
    </span>
  );
}
