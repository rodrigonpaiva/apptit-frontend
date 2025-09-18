"use client";

import * as React from "react";
import { cn } from "@/src/lib/cn";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type TrendPoint = number; // 0–100 (usaremos como % de altura)

export type KpiCardProps = {
  title: string;
  value: string | number;
  valuePrefix?: string;   // ex: "€"
  valueSuffix?: string;   // ex: "u", "pcs"
  deltaPct?: number;      // ex: 12.5 (positivo) ou -8.2 (negativo)
  deltaLabel?: string;    // ex: "vs 3 derniers mois"
  icon?: React.ReactNode; // ícone opcional à direita do título
  trend?: TrendPoint[];   // array para mini-barras (ex.: últimos 12 períodos)
  className?: string;
};

function formatNumber(n: string | number) {
  if (typeof n === "number") {
    return new Intl.NumberFormat("fr-FR").format(n);
  }
  return n;
}

export function KpiCard({
  title,
  value,
  valuePrefix,
  valueSuffix,
  deltaPct,
  deltaLabel = "vs 3 derniers mois",
  icon,
  trend,
  className,
}: KpiCardProps) {
  const positive = typeof deltaPct === "number" ? deltaPct > 0 : undefined;
  const negative = typeof deltaPct === "number" ? deltaPct < 0 : undefined;
  const neutral  = typeof deltaPct === "number" ? deltaPct === 0 : undefined;

  const deltaColorClass = positive
    ? "text-[var(--color-success)]"
    : negative
    ? "text-[var(--color-error)]"
    : "text-[var(--color-info)]";

  const deltaBgClass = positive
    ? "bg-[color-mix(in_oklab,var(--color-success)_14%,transparent)]"
    : negative
    ? "bg-[color-mix(in_oklab,var(--color-error)_14%,transparent)]"
    : "bg-[color-mix(in_oklab,var(--color-info)_14%,transparent)]";

  return (
    <div className={cn("card animate-scale-in", className)}>
      <div className="card-content">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="caption-top text-xl font-black ">{title}</p>
          {icon ? <div className="text-[var(--text-secondary)]">{icon}</div> : null}
        </div>

        {/* Valor principal */}
        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-5xl font-extrabold leading-none">
            {valuePrefix ? `${valuePrefix} ` : null}
            {formatNumber(value)}
            {valueSuffix ? <span className="text-base font-normal text-[var(--text-secondary)]"> {valueSuffix}</span> : null}
          </div>
        </div>

        {/* Delta */}
        {typeof deltaPct === "number" && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium"
               style={{ background: "transparent", border: "1px solid var(--border-default)" }}>
            <span className={cn("inline-flex items-center gap-1", deltaColorClass)}>
              {deltaPct > 0 ? <ArrowUpRight className="icon-sm" /> : deltaPct < 0 ? <ArrowDownRight className="icon-sm" /> : null}
              {Math.abs(deltaPct).toLocaleString("fr-FR", { maximumFractionDigits: 1 })}%
            </span>
            <span className="text-[var(--text-secondary)]">{deltaLabel}</span>
          </div>
        )}

        {/* Trend mini-chart (opcional) */}
        {Array.isArray(trend) && trend.length > 0 && (
          <div className="mt-4">
            <div className="flex items-end gap-1 h-12">
              {trend.map((v, i) => {
                // clamp 0–100
                const h = Math.max(2, Math.min(100, v));
                const barColor =
                  positive ? "var(--color-success)" :
                  negative ? "var(--color-error)" :
                             "var(--color-info)";

                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${(h / 100) * 100}%`,
                      background: `color-mix(in oklab, ${barColor} 55%, transparent)`,
                      boxShadow: "inset 0 -1px 0 rgb(0 0 0 / 0.05)",
                    }}
                    aria-hidden
                  />
                );
              })}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">Tendance 3 derniers mois</div>
          </div>
        )}
      </div>
    </div>
  );
}