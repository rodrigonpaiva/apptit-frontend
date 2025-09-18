import { ComplianceGauge } from "@/src/components/haccp/ComplianceGauge";
import { ScheduleBadge } from "@/src/components/haccp/ScheduleBadge";
import { TemperatureChip } from "@/src/components/haccp/TemperatureChip";

export default function HaccpUiPreviewPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 bg-[var(--surface-bg)] px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">HACCP UI Preview</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Quick glance at HACCP-specific design system components.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <ComplianceGauge
          value={92}
          label="Weekly compliance"
          description="Percentage of validated checklists across monitored kitchens."
        />
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-default)] bg-white p-6 shadow-smx">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Operational signals</h2>
          <ScheduleBadge nextAt="14:45" label="Next audit" />
          <div className="flex flex-wrap gap-3">
            <TemperatureChip value={2.8} label="Cold room A" />
            <TemperatureChip value={6.1} label="Service line" />
            <TemperatureChip value={-7.4} label="Freezer" />
          </div>
        </div>
      </section>
    </div>
  );
}
