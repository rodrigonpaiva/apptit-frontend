"use client";

import { type ReactNode } from "react";
import { Leaf, Scale, Flame, Droplet, Drumstick } from "lucide-react";

import { cn } from "@/src/lib/cn";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

export type NutriEcoStripProps = {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  ecoScore?: string;
  servingsLabel?: string;
  className?: string;
};

function formatMetric(value?: number, fractionDigits = 0) {
  if (typeof value !== "number") {
    return undefined;
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function NutriEcoStrip({
  calories,
  protein,
  carbohydrates,
  fat,
  ecoScore,
  servingsLabel,
  className,
}: NutriEcoStripProps) {
  const dict = useScopedI18n("menus");
  const labels = dict.nutriEco ?? {};
  const metrics: Array<{ key: string; label: string; value?: string; icon: ReactNode }> = [];

  const perServing = servingsLabel ?? labels.perServing;

  if (typeof calories === "number") {
    const value = formatMetric(calories);
    metrics.push({
      key: "calories",
      label: labels.calories ?? "Calories",
      value: value ? `${value} kcal${perServing ? ` · ${perServing}` : ""}` : undefined,
      icon: <Flame className="h-4 w-4" aria-hidden />,
    });
  }

  if (typeof protein === "number") {
    metrics.push({
      key: "protein",
      label: labels.protein ?? "Protein",
      value: `${formatMetric(protein, 1)} g`,
      icon: <Drumstick className="h-4 w-4" aria-hidden />,
    });
  }

  if (typeof carbohydrates === "number") {
    metrics.push({
      key: "carbohydrates",
      label: labels.carbs ?? "Carbs",
      value: `${formatMetric(carbohydrates, 1)} g`,
      icon: <Scale className="h-4 w-4" aria-hidden />,
    });
  }

  if (typeof fat === "number") {
    metrics.push({
      key: "fat",
      label: labels.fat ?? "Fat",
      value: `${formatMetric(fat, 1)} g`,
      icon: <Droplet className="h-4 w-4" aria-hidden />,
    });
  }

  if (ecoScore) {
    metrics.push({
      key: "eco",
      label: labels.ecoScore ?? "Eco-score",
      value: ecoScore,
      icon: <Leaf className="h-4 w-4" aria-hidden />,
    });
  }

  if (metrics.length === 0) {
    return null;
  }

  return (
    <dl
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-3 text-sm",
        className
      )}
      aria-label={labels.title ?? "Nutrition summary"}
    >
      {metrics.map((metric) => (
        <div key={metric.key} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--text-primary)] shadow-smx">
            {metric.icon}
          </span>
          <div className="flex flex-col text-xs">
            <span className="font-medium text-[var(--text-primary)]">{metric.label}</span>
            {metric.value ? (
              <span className="text-[var(--text-secondary)]">{metric.value}</span>
            ) : null}
          </div>
        </div>
      ))}
    </dl>
  );
}
