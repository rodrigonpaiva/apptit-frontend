"use client";

import { useMemo, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Select } from "@/src/components/ui/select";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import {
  useControlPointsQuery,
  useHaccpLogsQuery,
} from "@/src/graphql/hooks";
import type { HaccpLogEntry } from "@/src/graphql/types";
import { HaccpMeasureSheet } from "@/src/components/haccp/HaccpMeasureSheet";
import { cn } from "@/src/lib/cn";

export default function HaccpLogsPage() {
  const dict = useScopedI18n("haccp");
  const { data: controlPointsData } = useControlPointsQuery();
  const { data: logsData } = useHaccpLogsQuery();
  const controlPoints = controlPointsData ?? [];
  const sourceLogs = logsData ?? [];

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pointFilter, setPointFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>();

  const logs = useMemo(() => {
    return (logsData ?? []).filter((log) => {
      if (pointFilter !== "all" && log.pointId !== pointFilter) {
        return false;
      }

      if (modeFilter !== "all" && log.mode !== modeFilter) {
        return false;
      }

      if (dateFrom) {
        const logDate = new Date(log.timestamp);
        if (logDate < new Date(dateFrom)) {
          return false;
        }
      }

      if (dateTo) {
        const logDate = new Date(log.timestamp);
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (logDate > end) {
          return false;
        }
      }

      return true;
    });
  }, [dateFrom, dateTo, modeFilter, pointFilter, logsData]);

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setPointFilter("all");
    setModeFilter("all");
  };

  const handleMeasure = (pointId?: string) => {
    setSelectedPointId(pointId);
    setSheetOpen(true);
  };

  const formatTimestamp = (log: HaccpLogEntry) => {
    const date = new Date(log.timestamp);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[var(--border-default)] bg-white p-6 shadow-smx">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            {dict.logsHeading}
          </h1>
          <Button variant="ghost" onClick={resetFilters}>
            {dict.logsPage.filters.reset}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label className="form-label" htmlFor="date-from">
              {dict.logsPage.filters.dateFrom}
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="input"
            />
          </div>
          <div className="space-y-2">
            <label className="form-label" htmlFor="date-to">
              {dict.logsPage.filters.dateTo}
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="input"
            />
          </div>
          <div className="space-y-2">
            <label className="form-label" htmlFor="filter-point">
              {dict.logsPage.filters.controlPoint}
            </label>
            <Select
              id="filter-point"
              value={pointFilter}
              onChange={(event) => setPointFilter(event.target.value)}
            >
              <option value="all">{dict.logsPage.filters.allPoints}</option>
              {controlPoints.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="form-label" htmlFor="filter-mode">
              {dict.logsPage.filters.mode}
            </label>
            <Select
              id="filter-mode"
              value={modeFilter}
              onChange={(event) => setModeFilter(event.target.value)}
            >
              <option value="all">{dict.logsPage.filters.modeAll}</option>
              <option value="manual">{dict.logsPage.filters.modeManual}</option>
              <option value="iot">{dict.logsPage.filters.modeIot}</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-white shadow-smx">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {dict.logsHeading}
          </h2>
          <Button type="button" variant="primary" onClick={() => handleMeasure(pointFilter === "all" ? undefined : pointFilter)}>
            {dict.logsPage.measureButton}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-default)]">
            <thead className="bg-[var(--surface-raised)]">
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                <th className="px-6 py-3 font-semibold">{dict.logsPage.table.point}</th>
                <th className="px-6 py-3 font-semibold">{dict.logsPage.table.value}</th>
                <th className="px-6 py-3 font-semibold">{dict.logsPage.table.unit}</th>
                <th className="px-6 py-3 font-semibold">{dict.logsPage.table.timestamp}</th>
                <th className="px-6 py-3 font-semibold">{dict.logsPage.table.operator}</th>
                <th className="px-6 py-3 font-semibold">{dict.logsPage.table.mode}</th>
                <th className="px-6 py-3 font-semibold">{dict.logsPage.table.status}</th>
                <th className="px-6 py-3 font-semibold">{dict.logsPage.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)] bg-white text-sm text-[var(--text-primary)]">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 font-medium">{log.pointLabel}</td>
                  <td className="px-6 py-4">{log.value.toFixed(1)}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{log.unit}</td>
                  <td className="px-6 py-4">{formatTimestamp(log)}</td>
                  <td className="px-6 py-4">{log.operator}</td>
                  <td className="px-6 py-4 capitalize">{log.mode}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "badge",
                        log.status === "ok" ? "badge-success" : "badge-warning"
                      )}
                    >
                      {log.status === "ok"
                        ? dict.logsPage.table.statusOk
                        : dict.logsPage.table.statusNc}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleMeasure(log.pointId)}
                    >
                      {dict.logsPage.measureButton}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <HaccpMeasureSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        points={controlPoints}
        defaultPointId={selectedPointId}
      />
    </section>
  );
}
