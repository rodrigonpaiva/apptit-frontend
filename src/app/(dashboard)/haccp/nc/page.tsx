"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { NcBoardColumns } from "@/src/components/haccp/NcBoardColumns";
import {
  useNcBoardQuery,
  useControlPointsQuery,
  useOpenNcMutation,
  useAddCorrectiveActionMutation,
  useCloseNcMutation,
} from "@/src/graphql/hooks";
import type { NcBoardItem } from "@/src/graphql/types";
import { HaccpMeasureSheet } from "@/src/components/haccp/HaccpMeasureSheet";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetClose } from "@/src/components/ui/sheet";
import { CorrectiveActionForm } from "@/src/components/haccp/CorrectiveActionForm";
import { Select } from "@/src/components/ui/select";

const ASSIGNEES = ["Marie L.", "Paul R.", "Quality team", "IoT team"];

export default function HaccpNcPage() {
  const dict = useScopedI18n("haccp");
  const common = useScopedI18n("common");
  const { data: boardData } = useNcBoardQuery();
  const { data: controlPointsData } = useControlPointsQuery();
  const openNc = useOpenNcMutation();
  const addAction = useAddCorrectiveActionMutation();
  const closeNc = useCloseNcMutation();
  const controlPoints = controlPointsData ?? [];

  const [sheetOpen, setSheetOpen] = useState(false);
  const [measureSheetOpen, setMeasureSheetOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>();
  const [selectedNc, setSelectedNc] = useState<NcBoardItem | null>(null);
  const [boardItems, setBoardItems] = useState<NcBoardItem[]>(boardData ?? []);

  const [newNc, setNewNc] = useState({
    pointId: "",
    description: "",
    severity: "medium" as const,
    due: "",
    assignee: ASSIGNEES[0] ?? "",
  });

  useEffect(() => {
    setBoardItems(boardData ?? []);
  }, [boardData]);

  useEffect(() => {
    setNewNc((prev) => ({
      ...prev,
      pointId: prev.pointId || controlPoints[0]?.id || "",
    }));
  }, [controlPoints]);

  const kanbanItems = useMemo(() => boardItems, [boardItems]);

  const handleOpenNc = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await openNc.mutate(newNc);
    setSheetOpen(false);
  };

  const handleAddAction = async (payload: { action: string; assignee: string; due: string; evidence?: File | null }) => {
    if (!selectedNc) return;
    await addAction.mutate(selectedNc.id, payload);
  };

  const handleCloseNc = async () => {
    if (!selectedNc) return;
    await closeNc.mutate(selectedNc.id);
    setSelectedNc(null);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="primary" onClick={() => setSheetOpen(true)}>
          {dict.nc.openNcButton}
        </Button>
      </div>

      <NcBoardColumns
        items={kanbanItems}
        onViewNc={(id) => {
          const nc = boardItems.find((item) => item.id === id) ?? null;
          setSelectedNc(nc);
        }}
        onMoveNc={(id, status) => {
          setBoardItems((prev) => {
            const next = prev.map((item) => (item.id === id ? { ...item, status } : item));
            if (selectedNc) {
              const updated = next.find((item) => item.id === selectedNc.id) ?? null;
              setSelectedNc(updated);
            }
            return next;
          });
        }}
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <form className="flex h-full flex-col" onSubmit={handleOpenNc}>
            <SheetHeader>
              <SheetTitle>{dict.nc.modal.title}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              <div className="space-y-2">
                <label className="form-label" htmlFor="nc-point">
                  {dict.nc.modal.point}
                </label>
                <Select
                  id="nc-point"
                  value={newNc.pointId}
                  onChange={(event) => setNewNc((prev) => ({ ...prev, pointId: event.target.value }))}
                >
                  {controlPoints.map((point) => (
                    <option key={point.id} value={point.id}>
                      {point.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="form-label" htmlFor="nc-description">
                  {dict.nc.modal.description}
                </label>
                <textarea
                  id="nc-description"
                  className="input min-h-[96px] resize-none"
                  value={newNc.description}
                  onChange={(event) => setNewNc((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="form-label" htmlFor="nc-severity">
                    {dict.nc.modal.severity}
                  </label>
                  <Select
                    id="nc-severity"
                    value={newNc.severity}
                    onChange={(event) => setNewNc((prev) => ({ ...prev, severity: event.target.value as typeof prev.severity }))}
                  >
                    <option value="low">{dict.nc.modal.severityLow}</option>
                    <option value="medium">{dict.nc.modal.severityMedium}</option>
                    <option value="high">{dict.nc.modal.severityHigh}</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="form-label" htmlFor="nc-due">
                    {dict.nc.modal.due}
                  </label>
                  <input
                    id="nc-due"
                    type="date"
                    className="input"
                    value={newNc.due}
                    onChange={(event) => setNewNc((prev) => ({ ...prev, due: event.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="form-label" htmlFor="nc-assignee">
                  {dict.nc.modal.assignee}
                </label>
                <Select
                  id="nc-assignee"
                  value={newNc.assignee}
                  onChange={(event) => setNewNc((prev) => ({ ...prev, assignee: event.target.value }))}
                >
                  {ASSIGNEES.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <SheetFooter className="flex items-center justify-end gap-3 border-t border-[var(--border-default)] px-6 py-4">
              <SheetClose asChild>
                <Button type="button" variant="ghost">
                  {dict.nc.modal.cancel}
                </Button>
              </SheetClose>
              <Button type="submit" variant="primary" disabled={openNc.loading}>
                {openNc.loading ? common.saving : dict.nc.modal.submit}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {selectedNc ? (
        <Sheet open onOpenChange={(open) => !open && setSelectedNc(null)}>
          <SheetContent className="max-w-2xl">
            <div className="flex h-full flex-col">
              <SheetHeader>
                <SheetTitle>{selectedNc.title}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-[var(--text-primary)]">
                    {dict.nc.card.type}: {selectedNc.type}
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    {dict.nc.card.cause}: {selectedNc.cause}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                    <span>
                      {dict.nc.card.due}: {selectedNc.due}
                    </span>
                    <span>
                      {dict.nc.card.assignee}: {selectedNc.assignee}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                    {dict.nc.drawer.title}
                  </h3>
                  <CorrectiveActionForm assignees={ASSIGNEES} onSubmit={handleAddAction} />
                </div>
              </div>
              <SheetFooter className="flex items-center justify-between border-t border-[var(--border-default)] px-6 py-4">
                <Button variant="secondary" onClick={() => handleMeasureSheet(selectedNc.pointId)}>
                  {dict.logsPage.measureButton}
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={() => setSelectedNc(null)}>
                    {dict.nc.modal.cancel}
                  </Button>
                  <Button variant="primary" onClick={handleCloseNc} disabled={closeNc.loading}>
                    {closeNc.loading ? "Closing..." : dict.nc.drawer.closeNc}
                  </Button>
                </div>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
      ) : null}

      <HaccpMeasureSheet
        open={measureSheetOpen}
        onOpenChange={setMeasureSheetOpen}
        points={controlPoints}
        defaultPointId={selectedPointId}
      />
    </section>
  );

  function handleMeasureSheet(pointId?: string) {
    setSelectedPointId(pointId);
    setMeasureSheetOpen(true);
  }
}
