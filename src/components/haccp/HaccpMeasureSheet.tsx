"use client";

import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetClose } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Select } from "@/src/components/ui/select";
import { TemperatureInputPad } from "./TemperatureInputPad";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import { useCreateHaccpLogMutation } from "@/src/graphql/hooks";
import type { HaccpControlPoint } from "@/src/graphql/types";
import { cn } from "@/src/lib/cn";

export type HaccpMeasureSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: HaccpControlPoint[];
  defaultPointId?: string;
};

export function HaccpMeasureSheet({ open, onOpenChange, points, defaultPointId }: HaccpMeasureSheetProps) {
  const dict = useScopedI18n("haccp");
  const common = useScopedI18n("common");
  const { mutate, loading } = useCreateHaccpLogMutation();
  const [pointId, setPointId] = useState<string>(defaultPointId ?? points[0]?.id ?? "");
  const [value, setValue] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setPointId(defaultPointId ?? points[0]?.id ?? "");
      setValue("");
      setNote("");
      setPhoto(null);
    }
  }, [open, defaultPointId, points]);

  const selectedPoint = useMemo(() => points.find((p) => p.id === pointId), [points, pointId]);

  const parsedValue = parseFloat(value);
  const withinThreshold = useMemo(() => {
    if (!selectedPoint || Number.isNaN(parsedValue)) {
      return null;
    }
    return parsedValue >= selectedPoint.min && parsedValue <= selectedPoint.max;
  }, [parsedValue, selectedPoint]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPoint || Number.isNaN(parsedValue)) {
      return;
    }

    await mutate({
      pointId: selectedPoint.id,
      value: parsedValue,
      unit: selectedPoint.unit,
      note,
      mode: selectedPoint.mode,
      photo,
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form className="flex h-full flex-col" onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{dict.measure.title}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <div className="space-y-2">
              <label className="form-label" htmlFor="measure-point">
                {dict.measure.controlPoint}
              </label>
              <Select
                id="measure-point"
                value={pointId}
                onChange={(event) => setPointId(event.target.value)}
              >
                {points.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.label}
                  </option>
                ))}
              </Select>
              {selectedPoint ? (
                <p className="form-help">
                  {dict.upcomingControls.threshold}: {selectedPoint.threshold}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              <label className="form-label">{dict.measure.value}</label>
              <TemperatureInputPad value={value} onChange={setValue} unit={selectedPoint?.unit ?? "°C"} />
              {withinThreshold !== null ? (
                <div
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm",
                    withinThreshold
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  )}
                >
                  {withinThreshold ? dict.measure.statusOk : dict.measure.statusNc}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="form-label" htmlFor="measure-photo">
                {dict.measure.photo}
              </label>
              <input
                id="measure-photo"
                type="file"
                accept="image/*"
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                className="input"
              />
              <p className="form-help">{dict.measure.upload}</p>
            </div>

            <div className="space-y-2">
              <label className="form-label" htmlFor="measure-note">
                {dict.measure.note}
              </label>
              <textarea
                id="measure-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                className="input min-h-[96px] resize-none"
                placeholder={dict.measure.placeholderNote}
              />
            </div>
          </div>

          <SheetFooter className="flex items-center justify-end gap-3">
            <SheetClose asChild>
              <Button type="button" variant="ghost">
                {dict.measure.cancel}
              </Button>
            </SheetClose>
            <Button type="submit" variant="primary" disabled={loading || Number.isNaN(parsedValue)}>
              {loading ? common.saving : dict.measure.save}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
