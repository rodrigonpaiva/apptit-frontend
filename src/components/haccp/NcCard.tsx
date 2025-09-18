"use client";

import { useScopedI18n } from "@/src/lib/useScopedI18n";
import { cn } from "@/src/lib/cn";

export type NcSeverity = "low" | "medium" | "high";

export type NcCardProps = {
  id: string;
  type: string;
  severity: NcSeverity;
  cause: string;
  due: string;
  assignee: string;
  actionsCount: number;
  pointId?: string;
  className?: string;
  onView?: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (id: string, event: React.DragEvent<HTMLDivElement>) => void;
};

const SEVERITY_COLORS: Record<NcSeverity, string> = {
  low: "badge-success",
  medium: "badge-warning",
  high: "badge-danger",
};

export function NcCard({
  id,
  type,
  severity,
  cause,
  due,
  assignee,
  actionsCount,
  className,
  onView,
  draggable,
  onDragStart,
}: NcCardProps) {
  const dict = useScopedI18n("haccp");
  const severityBadge = SEVERITY_COLORS[severity];

  return (
    <article
      className={cn(
        "card cursor-pointer border border-[var(--border-default)] bg-white shadow-smx transition-shadow hover:shadow-mdx",
        className
      )}
      draggable={draggable}
      onDragStart={(event) => {
        if (draggable) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("application/x-haccp-nc", id);
          onDragStart?.(id, event);
        }
      }}
      onClick={() => onView?.(id)}
    >
      <div className="card-content space-y-3">
        <header className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {type}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {dict.nc.card.cause}: {cause}
            </p>
          </div>
          <span className={cn("badge", severityBadge)}>
            {dict.nc.modal[`severity${severity.charAt(0).toUpperCase() + severity.slice(1)}`]}
          </span>
        </header>

        <div className="grid gap-2 text-xs text-[var(--text-secondary)]">
          <p>
            <span className="font-semibold">{dict.nc.card.due}: </span>
            {due}
          </p>
          <p>
            <span className="font-semibold">{dict.nc.card.assignee}: </span>
            {assignee}
          </p>
        </div>

        <footer className="text-xs text-[var(--text-secondary)]">
          <span>{dict.nc.card.actionsCount.replace("{count}", String(actionsCount))}</span>
        </footer>
      </div>
    </article>
  );
}
