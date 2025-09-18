"use client";

import { cn } from "@/src/lib/cn";

export type TemperatureInputPadProps = {
  value: string;
  unit?: "°C" | "°F";
  onChange: (value: string) => void;
  className?: string;
};

const KEYS: string[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["CLR", "0", "."],
];

export function TemperatureInputPad({ value, unit = "°C", onChange, className }: TemperatureInputPadProps) {
  const handleKeyPress = (key: string) => {
    if (key === "CLR") {
      onChange("");
      return;
    }

    if (key === ".") {
      if (value.includes(".")) {
        return;
      }
      onChange(value ? `${value}.` : "0.");
      return;
    }

    onChange(value === "0" ? key : `${value}${key}`);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-baseline justify-between rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] px-3 py-2">
        <span className="text-2xl font-semibold text-[var(--text-primary)]">{value || "0"}</span>
        <span className="text-sm text-[var(--text-secondary)]">{unit}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {KEYS.flat().map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKeyPress(key)}
            className={cn(
              "btn",
              key === "CLR" ? "btn-tertiary" : "btn-secondary"
            )}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
