"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Select } from "@/src/components/ui/select";
import { cn } from "@/src/lib/cn";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

export type CorrectiveActionFormProps = {
  onSubmit: (payload: { action: string; assignee: string; due: string; evidence?: File | null }) => Promise<void> | void;
  assignees: string[];
  className?: string;
};

export function CorrectiveActionForm({ onSubmit, assignees, className }: CorrectiveActionFormProps) {
  const dict = useScopedI18n("haccp");
  const common = useScopedI18n("common");
  const [action, setAction] = useState<string>("");
  const [assignee, setAssignee] = useState<string>(assignees[0] ?? "");
  const [due, setDue] = useState<string>("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ action, assignee, due, evidence });
      setAction("");
      setDue("");
      setEvidence(null);
    } finally {
      setSubmitting(false);
    }
  };

  const validationMessage = !action || !assignee || !due ? dict.nc.validations.required : null;

  return (
    <form className={cn("space-y-4", className)} onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="form-label" htmlFor="nc-action">
          {dict.nc.drawer.actionLabel}
        </label>
        <textarea
          id="nc-action"
          className="input min-h-[96px] resize-none"
          value={action}
          onChange={(event) => setAction(event.target.value)}
          placeholder={dict.nc.drawer.addAction}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="form-label" htmlFor="nc-assignee">
            {dict.nc.drawer.assignee}
          </label>
          <Select
            id="nc-assignee"
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
          >
            {assignees.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="form-label" htmlFor="nc-due">
            {dict.nc.drawer.due}
          </label>
          <input
            id="nc-due"
            type="date"
            className="input"
            value={due}
            onChange={(event) => setDue(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="form-label" htmlFor="nc-evidence">
          {dict.nc.drawer.evidence}
        </label>
        <input
          id="nc-evidence"
          type="file"
          accept="image/*"
          className="input"
          onChange={(event) => setEvidence(event.target.files?.[0] ?? null)}
        />
      </div>

      {validationMessage ? (
        <p className="text-xs text-red-600">{validationMessage}</p>
      ) : null}

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={submitting || Boolean(validationMessage)}>
          {submitting ? common.saving : dict.nc.drawer.save}
        </Button>
      </div>
    </form>
  );
}
