"use client";

import { useMemo } from "react";
import { NcCard, type NcCardProps } from "./NcCard";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import { cn } from "@/src/lib/cn";

export type NcStatusColumnKey = "todo" | "inProgress" | "review" | "closed";

export type NcBoardItem = NcCardProps & {
  status: NcStatusColumnKey;
};

export type NcBoardColumnsProps = {
  items: NcBoardItem[];
  className?: string;
  onViewNc?: (id: string) => void;
  onMoveNc?: (id: string, status: NcStatusColumnKey) => void;
};

const COLUMN_ORDER: NcStatusColumnKey[] = ["todo", "inProgress", "review", "closed"];

export function NcBoardColumns({ items, className, onViewNc, onMoveNc }: NcBoardColumnsProps) {
  const dict = useScopedI18n("haccp");

  const grouped = useMemo(() => {
    return COLUMN_ORDER.map((key) => ({
      key,
      label: dict.nc.columns[key],
      cards: items.filter((item) => item.status === key),
    }));
  }, [items, dict.nc.columns]);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-4", className)}>
      {grouped.map((column) => (
        <div
          key={column.key}
          className="flex min-h-[320px] flex-col gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4"
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event) => {
            const id = event.dataTransfer.getData("application/x-haccp-nc");
            if (id && onMoveNc) {
              onMoveNc(id, column.key);
            }
          }}
        >
          <header className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {column.label}
            </h3>
            <span className="badge badge-muted">{column.cards.length}</span>
          </header>

          <div className="flex flex-1 flex-col gap-4">
            {column.cards.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)]">{dict.alerts.noAlerts}</p>
            ) : (
              column.cards.map((card) => (
                <NcCard
                  key={card.id}
                  {...card}
                  draggable
                  onView={onViewNc}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
