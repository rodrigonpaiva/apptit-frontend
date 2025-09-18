"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChefHat,
  ClipboardList,
  Inbox,
  LogOutIcon,
  Menu as MenuIcon,
  PackageIcon,
  TruckElectricIcon,
  UsersRoundIcon,
  Warehouse,
  CheckCircle2,
  X,
} from "lucide-react";

import Navbar from "@/src/components/dashboard/navbar";
import { ModuleHeader } from "@/src/components/dashboard/module-header";
import { KpiCard } from "@/src/components/dashboard/kpi-card";

type QuickAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: JSX.Element;
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  badge: string;
  icon: JSX.Element;
};

type TaskStatus = "done" | "in-progress" | "pending";

type TaskItem = {
  id: string;
  title: string;
  due: string;
  status: TaskStatus;
};

type InsightStatus = "positive" | "negative" | "neutral";

type ServiceInsight = {
  id: string;
  label: string;
  value: string;
  trend: string;
  status: InsightStatus;
  icon: JSX.Element;
};

const quickActions: QuickAction[] = [
  {
    id: "new-menu",
    title: "Create a menu",
    description: "Plan a new service or duplicate an existing menu.",
    href: "/menus",
    icon: <ChefHat className="icon-lg text-[var(--text-primary)]" />,
  },
  {
    id: "inventory",
    title: "Product inventory",
    description: "Review critical stock levels and adjust thresholds.",
    href: "/gestion-produits",
    icon: <PackageIcon className="icon-lg text-[var(--text-primary)]" />,
  },
  {
    id: "orders",
    title: "Track orders",
    description: "Check today's deliveries and any delays.",
    href: "#",
    icon: <TruckElectricIcon className="icon-lg text-[var(--text-primary)]" />,
  },
  {
    id: "reports",
    title: "Reports & analytics",
    description: "View HACCP KPIs and guest satisfaction trends.",
    href: "#",
    icon: <ClipboardList className="icon-lg text-[var(--text-primary)]" />,
  },
];

const activityFeed: ActivityItem[] = [
  {
    id: "activity-1",
    title: "Menu \"Monday Lunch\" published",
    description: "Marie Laurent confirmed service for 118 guests.",
    time: "5 minutes ago",
    badge: "Menus",
    icon: <ChefHat className="icon-md text-[var(--text-secondary)]" />,
  },
  {
    id: "activity-2",
    title: "Critical stock on 3 products",
    description: "Rodrigo Paiva lowered the threshold for organic tomatoes.",
    time: "32 minutes ago",
    badge: "Products",
    icon: <PackageIcon className="icon-md text-[var(--text-secondary)]" />,
  },
  {
    id: "activity-3",
    title: "Seafood delivery validated",
    description: "Logistics confirmed receipt of fresh cod.",
    time: "1 hour ago",
    badge: "Logistics",
    icon: <TruckElectricIcon className="icon-md text-[var(--text-secondary)]" />,
  },
];

const tasksToday: TaskItem[] = [
  {
    id: "task-1",
    title: "Confirm fresh produce deliveries",
    due: "Before 10:00",
    status: "in-progress",
  },
  {
    id: "task-2",
    title: "Update allergens for week 04 menus",
    due: "Today",
    status: "pending",
  },
  {
    id: "task-3",
    title: "Validate daily HACCP plan",
    due: "Completed at 07:30",
    status: "done",
  },
];

const taskStatusBadge: Record<TaskStatus, { label: string; className: string }> = {
  done: { label: "Done", className: "badge badge-success whitespace-nowrap" },
  "in-progress": {
    label: "In progress",
    className: "badge badge-info whitespace-nowrap",
  },
  pending: { label: "To do", className: "badge badge-warning whitespace-nowrap" },
};

const serviceInsights: ServiceInsight[] = [
  {
    id: "services",
    label: "Services today",
    value: "4",
    trend: "+1 vs yesterday",
    status: "positive",
    icon: <CalendarDays className="icon-md text-[var(--text-secondary)]" />,
  },
  {
    id: "headcount",
    label: "Expected guests",
    value: "214",
    trend: "Stable",
    status: "neutral",
    icon: <UsersRoundIcon className="icon-md text-[var(--text-secondary)]" />,
  },
  {
    id: "alerts",
    label: "HACCP alerts",
    value: "2",
    trend: "-3 vs last week",
    status: "positive",
    icon: <ClipboardList className="icon-md text-[var(--text-secondary)]" />,
  },
];

const insightAccent: Record<InsightStatus, string> = {
  positive: "text-[var(--color-success)]",
  negative: "text-[var(--color-error)]",
  neutral: "text-[var(--text-secondary)]",
};

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menusThisWeek = 12;
  const criticalProducts = 6;
  const deliveriesToday = 8;
  const satisfactionScore = 94;

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="navbar md:hidden">
        <div className="navbar-inner">
          <button
            type="button"
            className="btn btn-ghost"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="icon-lg" />
          </button>

          <div className="flex-1 text-center">
            <span className="font-semibold">Dashboard</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="#" className="text-[var(--text-secondary)] hover:opacity-80" aria-label="Inbox">
              <Inbox className="icon-lg" />
            </Link>
            <Link href="#" className="text-[var(--text-secondary)] hover:opacity-80" aria-label="Sign out">
              <LogOutIcon className="icon-lg" />
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px]">
        <div className="flex">
          <aside className="hidden w-72 shrink-0 border-0 md:block md:sticky md:top-0 md:h-screen md:overflow-y-auto">
            <Navbar />
          </aside>

          {sidebarOpen && (
            <div className="modal" role="dialog" aria-modal="true">
              <div className="modal-backdrop" onClick={() => setSidebarOpen(false)} />
              <div className="modal-panel !max-w-[320px] p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)]">
                  <span className="font-semibold">Menu</span>
                  <button
                    className="btn btn-ghost"
                    aria-label="Close menu"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="icon-lg" />
                  </button>
                </div>
                <div className="sidebar !w-full">
                  <Navbar />
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 w-full">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4">
              <div className="col-span-9">
                <ModuleHeader
                  userName="John Doe"
                  tenantName="Apptit Central Kitchen"
                  moduleName="Dashboard"
                  subtitle="Overview"
                  avatarSrc="/images/avatar-placeholder.png"
                />
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <nav className="flex gap-4">
                  <Link href="#" className="text-[var(--text-secondary)] hover:opacity-80" aria-label="Inbox">
                    <Inbox className="icon-lg" />
                  </Link>
                  <Link href="#" className="text-[var(--text-secondary)] hover:opacity-80" aria-label="Sign out">
                    <LogOutIcon className="icon-lg" />
                  </Link>
                </nav>
              </div>
            </div>

            <div className="md:hidden p-4">
              <ModuleHeader
                userName="John Doe"
                tenantName="Apptit Central Kitchen"
                moduleName="Dashboard"
                subtitle="Overview"
                avatarSrc="/images/avatar-placeholder.png"
              />
            </div>

            <section className="p-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard
                  title="Menus this week"
                  value={menusThisWeek}
                  valueSuffix="services"
                  deltaPct={8.4}
                  deltaLabel="vs last week"
                  icon={<CalendarDays size={36} />}
                  trend={[42, 45, 46, 48, 50, 53, 55, 58, 60]}
                />
                <KpiCard
                  title="Critical products"
                  value={criticalProducts}
                  deltaPct={-4.1}
                  deltaLabel="vs yesterday"
                  icon={<Warehouse size={36} />}
                  trend={[18, 17, 16, 16, 15, 14, 14, 13]}
                />
                <KpiCard
                  title="Deliveries today"
                  value={deliveriesToday}
                  deltaPct={2.5}
                  deltaLabel="vs average"
                  icon={<TruckElectricIcon size={36} />}
                  trend={[6, 6, 7, 7, 7, 8, 8, 8]}
                />
                <KpiCard
                  title="Guest satisfaction"
                  value={satisfactionScore}
                  valueSuffix="%"
                  deltaPct={1.2}
                  deltaLabel="vs last survey"
                  icon={<UsersRoundIcon size={36} />}
                  trend={[86, 88, 90, 91, 92, 93, 94]}
                />
              </div>
            </section>

            <section className="px-4 pb-6">
              <div className="grid gap-4 2xl:grid-cols-[2fr_1fr]">
                <div className="grid gap-4">
                  <div className="widget shadow-none border-0">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Quick actions</h2>
                        <p className="caption mt-1">Access your most used modules in one click.</p>
                      </div>
                      <Link href="#" className="btn btn-tertiary self-start md:self-auto">
                        Customize
                      </Link>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                      {quickActions.map((action) => (
                        <Link key={action.id} href={action.href} className="card transition-shadow hover:shadow-mdx">
                          <span className="sr-only">{action.title}</span>
                          <div className="card-content space-y-3">
                            <div className="w-12 h-12 rounded-lg bg-[color-mix(in_oklab,var(--text-primary)_6%,transparent)] grid place-items-center text-[var(--text-primary)]">
                              {action.icon}
                            </div>
                            <div className="space-y-1">
                              <p className="text-base font-semibold text-[var(--text-primary)]">{action.title}</p>
                              <p className="text-sm text-[var(--text-secondary)]">{action.description}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="widget shadow-none border-0">
                    <h2 className="text-lg font-semibold">Latest activity</h2>
                    <div className="mt-4 space-y-3">
                      {activityFeed.map((activity) => (
                        <div key={activity.id} className="border border-[var(--border-default)] rounded-xl px-4 py-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[color-mix(in_oklab,var(--text-primary)_6%,transparent)] grid place-items-center">
                              {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                  {activity.title}
                                </p>
                                <span className="badge">{activity.badge}</span>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] mt-1">
                                {activity.description}
                              </p>
                              <p className="caption mt-1 flex items-center gap-1">
                                <CalendarDays className="icon-sm" />
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="widget shadow-none border-0">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <ClipboardList className="icon-md" />
                      Today&apos;s tasks
                    </h3>
                    <div className="mt-3 space-y-3">
                      {tasksToday.map((task) => (
                        <div key={task.id} className="border border-[var(--border-default)] rounded-lg px-3 py-2">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[var(--text-primary)]">{task.title}</p>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">{task.due}</p>
                            </div>
                            <span className={taskStatusBadge[task.status].className}>
                              {taskStatusBadge[task.status].label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="widget shadow-none border-0">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CheckCircle2 className="icon-md text-[var(--color-success)]" />
                      Daily summary
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      {serviceInsights.map((insight) => (
                        <div key={insight.id} className="border border-[var(--border-default)] rounded-lg px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[color-mix(in_oklab,var(--text-primary)_6%,transparent)] grid place-items-center">
                              {insight.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[var(--text-primary)]">{insight.label}</p>
                              <p className="text-lg font-bold text-[var(--text-primary)]">{insight.value}</p>
                              <p className={`text-xs mt-1 ${insightAccent[insight.status]}`}>
                                {insight.trend}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
