"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Inbox, LogOutIcon, Menu, X } from "lucide-react";
import Navbar from "@/src/components/dashboard/navbar";
import { ModuleHeader } from "@/src/components/dashboard/module-header";
import { HaccpTabs } from "../../../components/haccp/haccp-tabs";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

export default function HaccpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const dict = useScopedI18n("haccp");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <Menu className="icon-lg" />
          </button>

          <div className="flex-1 text-center">
            <span className="font-semibold">{dict.title}</span>
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
              <div className="modal-panel !max-w-[320px] overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
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

          <main className="w-full flex-1 pb-12">
            <div className="hidden grid-cols-12 gap-4 p-4 md:grid">
              <div className="col-span-9">
                <ModuleHeader
                  userName="John Doe"
                  tenantName="Apptit Central Kitchen"
                  moduleName={dict.title}
                  subtitle={dict.subtitle}
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
                moduleName={dict.title}
                subtitle={dict.subtitle}
                avatarSrc="/images/avatar-placeholder.png"
              />
            </div>

            <div className="space-y-6 p-4 pt-0">
              <HaccpTabs />

              <div className="rounded-2xl border border-[var(--border-default)] bg-white shadow-smx">
                <div className="p-6">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
