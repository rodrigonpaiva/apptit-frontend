"use client";

import { useMemo, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Select } from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import {
  useControlPointSettingsQuery,
  useDeleteControlPointMutation,
  useUpsertControlPointMutation,
} from "@/src/graphql/hooks";
import type { ControlPointSetting } from "@/src/graphql/types";

const CONTROL_TYPES: ControlPointSetting["type"][] = ["cold_room", "hot_hold", "delivery"];

export default function HaccpSettingsPage() {
  const dict = useScopedI18n("haccp");
  const common = useScopedI18n("common");
  const { data: controlPointsData, refetch } = useControlPointSettingsQuery();
  const upsert = useUpsertControlPointMutation();
  const remove = useDeleteControlPointMutation();
  const controlPoints = controlPointsData ?? [];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    type: CONTROL_TYPES[0],
    min: "0",
    max: "4",
    frequency: "60",
  });

  const [alertsEmail, setAlertsEmail] = useState(true);
  const [alertsSms, setAlertsSms] = useState(false);

  const isEditingNew = editingId === "new";

  const startCreate = () => {
    setEditingId("new");
    setFormState({ name: "", type: CONTROL_TYPES[0], min: "0", max: "4", frequency: "60" });
  };

  const startEdit = (point: ControlPointSetting) => {
    setEditingId(point.id);
    setFormState({
      name: point.name,
      type: point.type,
      min: String(point.min),
      max: String(point.max),
      frequency: String(point.frequency),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const min = Number(formState.min);
    const max = Number(formState.max);
    const frequency = Number(formState.frequency);

    if (Number.isNaN(min) || Number.isNaN(max) || min >= max) {
      alert(dict.settingsPage.controlPoints.validationRange);
      return;
    }

    if (Number.isNaN(frequency) || frequency <= 0) {
      alert(dict.settingsPage.controlPoints.validationRange);
      return;
    }

    await upsert.mutate({
      id: isEditingNew ? undefined : editingId ?? undefined,
      name: formState.name,
      type: formState.type,
      min,
      max,
      frequency,
    });

    refetch();
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(dict.settingsPage.controlPoints.confirmDelete)) return;
    await remove.mutate(id);
    refetch();
  };

  const controlItems = useMemo(() => controlPoints, [controlPoints]);

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-[var(--border-default)] bg-white shadow-smx">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            {dict.settingsPage.controlPoints.title}
          </h1>
          <Button variant="primary" onClick={startCreate}>
            {dict.settingsPage.controlPoints.add}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-default)]">
            <thead className="bg-[var(--surface-raised)]">
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                <th className="px-6 py-3 font-semibold">{dict.settingsPage.controlPoints.name}</th>
                <th className="px-6 py-3 font-semibold">{dict.settingsPage.controlPoints.type}</th>
                <th className="px-6 py-3 font-semibold">{dict.settingsPage.controlPoints.min}</th>
                <th className="px-6 py-3 font-semibold">{dict.settingsPage.controlPoints.max}</th>
                <th className="px-6 py-3 font-semibold">{dict.settingsPage.controlPoints.frequency}</th>
                <th className="px-6 py-3 font-semibold">{dict.settingsPage.controlPoints.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)] bg-white text-sm text-[var(--text-primary)]">
              {isEditingNew ? (
                <EditableRow
                  dict={dict}
                  isNew
                  values={formState}
                  onChange={setFormState}
                  onCancel={cancelEdit}
                  onSubmit={handleSubmit}
                  loading={upsert.loading}
                />
              ) : null}
              {controlItems.map((point) => (
                editingId === point.id ? (
                  <EditableRow
                    key={point.id}
                    dict={dict}
                    values={formState}
                    onChange={setFormState}
                    onCancel={cancelEdit}
                    onSubmit={handleSubmit}
                    loading={upsert.loading}
                  />
                ) : (
                  <ReadOnlyRow
                    key={point.id}
                    dict={dict}
                    point={point}
                    onEdit={() => startEdit(point)}
                    onDelete={() => handleDelete(point.id)}
                  />
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-white p-6 shadow-smx">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {dict.settingsPage.alerts.title}
        </h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="flex items-center gap-2">
            <Checkbox checked={alertsEmail} onChange={(event) => setAlertsEmail(event.target.checked)} />
            <span className="text-sm text-[var(--text-primary)]">{dict.settingsPage.alerts.email}</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={alertsSms} onChange={(event) => setAlertsSms(event.target.checked)} />
            <span className="text-sm text-[var(--text-primary)]">{dict.settingsPage.alerts.sms}</span>
          </label>
        </div>
      </div>
    </section>
  );
}

function ReadOnlyRow({
  dict,
  point,
  onEdit,
  onDelete,
}: {
  dict: ReturnType<typeof useScopedI18n>;
  point: ControlPointSetting;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const typeLabel = {
    cold_room: dict.settingsPage.controlPoints.typeCold,
    hot_hold: dict.settingsPage.controlPoints.typeHot,
    delivery: dict.settingsPage.controlPoints.typeDelivery,
  }[point.type];

  return (
    <tr>
      <td className="px-6 py-4 font-medium">{point.name}</td>
      <td className="px-6 py-4 text-[var(--text-secondary)]">{typeLabel}</td>
      <td className="px-6 py-4">{point.min}</td>
      <td className="px-6 py-4">{point.max}</td>
      <td className="px-6 py-4">{point.frequency}</td>
      <td className="px-6 py-4 text-right space-x-2">
        <Button variant="secondary" onClick={onEdit}>
          {dict.settingsPage.controlPoints.edit}
        </Button>
        <Button variant="ghost" onClick={onDelete}>
          {dict.settingsPage.controlPoints.delete}
        </Button>
      </td>
    </tr>
  );
}

function EditableRow({
  dict,
  values,
  onChange,
  onCancel,
  onSubmit,
  loading,
}: {
  dict: ReturnType<typeof useScopedI18n>;
  values: { name: string; type: ControlPointSetting["type"]; min: string; max: string; frequency: string };
  onChange: React.Dispatch<React.SetStateAction<{ name: string; type: ControlPointSetting["type"]; min: string; max: string; frequency: string }>>;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-4">
        <form className="grid gap-3 md:grid-cols-6" onSubmit={onSubmit}>
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="cp-name">
              {dict.settingsPage.controlPoints.name}
            </label>
            <input
              id="cp-name"
              className="input"
              value={values.name}
              onChange={(event) => onChange((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="form-label" htmlFor="cp-type">
              {dict.settingsPage.controlPoints.type}
            </label>
            <Select
              id="cp-type"
              value={values.type}
              onChange={(event) => onChange((prev) => ({ ...prev, type: event.target.value as ControlPointSetting["type"] }))}
            >
              <option value="cold_room">{dict.settingsPage.controlPoints.typeCold}</option>
              <option value="hot_hold">{dict.settingsPage.controlPoints.typeHot}</option>
              <option value="delivery">{dict.settingsPage.controlPoints.typeDelivery}</option>
            </Select>
          </div>
          <div className="md:col-span-1">
            <label className="form-label" htmlFor="cp-min">
              {dict.settingsPage.controlPoints.min}
            </label>
            <input
              id="cp-min"
              type="number"
              className="input"
              value={values.min}
              onChange={(event) => onChange((prev) => ({ ...prev, min: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="form-label" htmlFor="cp-max">
              {dict.settingsPage.controlPoints.max}
            </label>
            <input
              id="cp-max"
              type="number"
              className="input"
              value={values.max}
              onChange={(event) => onChange((prev) => ({ ...prev, max: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="form-label" htmlFor="cp-frequency">
              {dict.settingsPage.controlPoints.frequency}
            </label>
            <input
              id="cp-frequency"
              type="number"
              className="input"
              value={values.frequency}
              onChange={(event) => onChange((prev) => ({ ...prev, frequency: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-6 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              {dict.nc.modal.cancel}
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? common.saving : dict.nc.modal.submit}
            </Button>
          </div>
        </form>
      </td>
    </tr>
  );
}
