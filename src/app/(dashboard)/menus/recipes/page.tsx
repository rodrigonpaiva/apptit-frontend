"use client";

import { MenusPlaceholderSection } from "@/src/components/menus/MenusPlaceholderSection";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

export default function MenusRecipesPage() {
  const dict = useScopedI18n("menus");

  return (
    <MenusPlaceholderSection
      id="menus-recipes"
      heading={dict.recipes.heading}
      description={dict.recipes.description}
      emptyTitle={dict.recipes.empty.title}
      emptyDescription={dict.recipes.empty.description}
      actionLabel={dict.recipes.empty.action}
    />
  );
}
