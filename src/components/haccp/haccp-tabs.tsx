"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

const TAB_ROUTES = {
  dashboard: "/haccp",
  logs: "/haccp/logs",
  nc: "/haccp/nc",
  settings: "/haccp/settings",
} as const;

type TabKey = keyof typeof TAB_ROUTES;

export function HaccpTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const dict = useScopedI18n("haccp");

  const activeTab = useMemo<TabKey>(() => {
    if (!pathname) {
      return "dashboard";
    }

    const match = (Object.entries(TAB_ROUTES) as Array<[TabKey, string]>).find(([, route]) =>
      pathname === route
    );

    return match ? match[0] : "dashboard";
  }, [pathname]);

  const handleTabChange = (value: string) => {
    if (value in TAB_ROUTES) {
      router.push(TAB_ROUTES[value as TabKey]);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start gap-2 overflow-x-auto border-none bg-transparent">
        <TabsTrigger
          value="dashboard"
          className="text-gray-500 transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {dict.tabs.dashboard}
        </TabsTrigger>
        <TabsTrigger
          value="logs"
          className="text-gray-500 transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {dict.tabs.logs}
        </TabsTrigger>
        <TabsTrigger
          value="nc"
          className="text-gray-500 transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {dict.tabs.nc}
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="text-gray-500 transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {dict.tabs.settings}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
