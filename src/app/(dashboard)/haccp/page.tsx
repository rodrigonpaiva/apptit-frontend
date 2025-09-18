"use client";

import { ComplianceGauge } from "@/src/components/haccp/ComplianceGauge";
import { Button } from "@/src/components/ui/button";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import { useHaccpDashboardQuery } from "@/src/graphql/hooks";
import { haccpDashboardMock } from "@/src/graphql/mocks/haccp";

export default function HaccpDashboardPage() {
  const dict = useScopedI18n("haccp");
  const { data } = useHaccpDashboardQuery();
  const dashboard = data ?? haccpDashboardMock;

  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ComplianceGauge
          value={dashboard.compliance}
          label={dict.kpis.compliance}
          description={dict.subtitle}
          className="md:col-span-1"
        />
        <div className="rounded-2xl border border-[var(--border-default)] bg-white p-5 shadow-smx">
          <p className="text-sm font-medium text-[var(--text-secondary)]">{dict.kpis.openNc}</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--text-primary)]">
            {dashboard.openNonConformities}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {dict.kpis.openNcDescription}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border-default)] bg-white p-5 shadow-smx">
          <p className="text-sm font-medium text-[var(--text-secondary)]">{dict.kpis.offlineSensors}</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--text-primary)]">
            {dashboard.offlineSensors}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {dict.kpis.offlineSensorsDescription}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-[var(--border-default)] bg-white shadow-smx">
          <div className="border-b border-[var(--border-default)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {dict.upcomingControls.title}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-default)]">
              <thead className="bg-[var(--surface-raised)]">
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  <th className="px-6 py-3 font-semibold">{dict.upcomingControls.point}</th>
                  <th className="px-6 py-3 font-semibold">{dict.upcomingControls.threshold}</th>
                  <th className="px-6 py-3 font-semibold">{dict.upcomingControls.due}</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)] bg-white text-sm text-[var(--text-primary)]">
                {dashboard.upcomingControls.map((control) => (
                  <tr key={control.id}>
                    <td className="px-6 py-4 font-medium">{control.point}</td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">{control.threshold}</td>
                    <td className="px-6 py-4">{control.due}</td>
                    <td className="px-6 py-4 text-right">
                      <Button type="button" variant="secondary">
                        {dict.upcomingControls.action}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-white shadow-smx">
          <div className="border-b border-[var(--border-default)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {dict.alerts.title}
            </h2>
          </div>
          <div className="space-y-4 px-6 py-4">
            {dashboard.alerts.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">{dict.alerts.noAlerts}</p>
            ) : (
              dashboard.alerts.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-[var(--border-default)] px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="badge">
                        {alert.type === "nc" ? dict.alerts.nc : dict.alerts.sensor}
                      </span>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {alert.title}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">{alert.description}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-[var(--text-secondary)]">
                      {alert.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
