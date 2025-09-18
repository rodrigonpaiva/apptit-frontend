"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

const TAB_ROUTES = {
  week: "/menus",
  planner: "/menus/planner",
  recipes: "/menus/recipes",
  settings: "/menus/settings",
} as const;

type TabKey = keyof typeof TAB_ROUTES;

export function MenusTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const dict = useScopedI18n("menus");

  const activeTab = useMemo<TabKey>(() => {
    if (!pathname) {
      return "week";
    }

    const entries = Object.entries(TAB_ROUTES) as Array<[TabKey, string]>;
    const exactMatch = entries.find(([, route]) => pathname === route);
    if (exactMatch) {
      return exactMatch[0];
    }

    const startsWithMatch = entries.find(([, route]) => pathname.startsWith(`${route}/`));

    return startsWithMatch ? startsWithMatch[0] : "week";
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
          value="week"
          className="text-gray-500 transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {dict.tabs.week}
        </TabsTrigger>
        <TabsTrigger
          value="planner"
          className="text-gray-500 transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {dict.tabs.planner}
        </TabsTrigger>
        <TabsTrigger
          value="recipes"
          className="text-gray-500 transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {dict.tabs.recipes}
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
