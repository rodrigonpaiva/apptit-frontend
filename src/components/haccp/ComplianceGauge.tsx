"use client";

import { useMemo } from "react";
import { cn } from "@/src/lib/cn";

export type ComplianceGaugeStatus = "ok" | "warning" | "critical";

export type ComplianceGaugeProps = {
  value: number;
  label?: string;
  description?: string;
  size?: number;
  status?: ComplianceGaugeStatus;
  className?: string;
};

const STATUS_COLORS: Record<ComplianceGaugeStatus, string> = {
  ok: "#16A34A",
  warning: "#FACC15",
  critical: "#DC2626",
};

function resolveStatus(value: number): ComplianceGaugeStatus {
  if (value >= 90) {
    return "ok";
  }
  if (value >= 70) {
    return "warning";
  }
  return "critical";
}

export function ComplianceGauge({
  value,
  label,
  description,
  size = 140,
  status,
  className,
}: ComplianceGaugeProps) {
  const normalized = Math.min(Math.max(value, 0), 100);
  const resolvedStatus = status ?? resolveStatus(normalized);
  const accent = STATUS_COLORS[resolvedStatus];

  const gaugeStyle = useMemo(() => {
    const sweep = normalized * 3.6;
    const remainder = 360 - sweep;

    return {
      background: `conic-gradient(${accent} 0deg ${sweep}deg, rgba(148, 163, 184, 0.25) ${sweep}deg ${sweep + remainder}deg)`
    } as React.CSSProperties;
  }, [accent, normalized]);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-white p-4 shadow-smx",
        className
      )}
      role="figure"
      aria-label={label ?? "Compliance gauge"}
    >
      <div
        className="relative rounded-full p-3"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={gaugeStyle}
        />
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white text-center">
          <div>
            <span className="text-3xl font-semibold text-[var(--text-primary)]">
              {Math.round(normalized)}%
            </span>
            {label ? (
              <p className="text-xs text-[var(--text-secondary)]">{label}</p>
            ) : null}
          </div>
        </div>
      </div>

      {description ? (
        <p className="text-xs text-[var(--text-secondary)] text-center">
          {description}
        </p>
      ) : null}
    </div>
  );
}
