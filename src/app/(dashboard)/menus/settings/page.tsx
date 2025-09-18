"use client";

import { MenusPlaceholderSection } from "@/src/components/menus/MenusPlaceholderSection";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

export default function MenusSettingsPage() {
  const dict = useScopedI18n("menus");

  return (
    <MenusPlaceholderSection
      id="menus-settings"
      heading={dict.settings.heading}
      description={dict.settings.description}
      emptyTitle={dict.settings.empty.title}
      emptyDescription={dict.settings.empty.description}
      actionLabel={dict.settings.empty.action}
    />
  );
}
