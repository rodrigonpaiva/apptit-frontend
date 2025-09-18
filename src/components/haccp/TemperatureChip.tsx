"use client";

import { Thermometer } from "lucide-react";
import { cn } from "@/src/lib/cn";

export type TemperatureStatus = "ok" | "warning" | "critical";

export type TemperatureChipProps = {
  value: number;
  unit?: "°C" | "°F";
  status?: TemperatureStatus;
  label?: string;
  className?: string;
};

const STATUS_STYLES: Record<TemperatureStatus, { className: string; indicator: string }> = {
  ok: {
    className: "border-green-200 bg-green-50 text-green-900",
    indicator: "bg-green-500",
  },
  warning: {
    className: "border-yellow-200 bg-yellow-50 text-yellow-900",
    indicator: "bg-yellow-500",
  },
  critical: {
    className: "border-red-200 bg-red-50 text-red-900",
    indicator: "bg-red-500",
  },
};

function resolveStatus(value: number): TemperatureStatus {
  if (value >= -2 && value <= 4) {
    return "ok";
  }
  if (value >= -5 && value <= 8) {
    return "warning";
  }
  return "critical";
}

export function TemperatureChip({
  value,
  unit = "°C",
  status,
  label,
  className,
}: TemperatureChipProps) {
  const derivedStatus = status ?? resolveStatus(value);
  const styles = STATUS_STYLES[derivedStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        styles.className,
        className
      )}
    >
      <span
        aria-hidden
        className={cn("h-2.5 w-2.5 rounded-full", styles.indicator)}
      />
      <Thermometer className="h-4 w-4" aria-hidden />
      <span className="font-semibold">
        {value.toFixed(1)}{unit}
      </span>
      {label ? <span className="text-xs text-[var(--text-secondary)]">{label}</span> : null}
    </span>
  );
}
