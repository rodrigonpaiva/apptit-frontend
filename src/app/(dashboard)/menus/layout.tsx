import { type ReactNode } from "react";
import { MenusLayoutShell } from "@/src/components/menus/MenusLayoutShell";

export default function MenusLayout({ children }: { children: ReactNode }) {
  return <MenusLayoutShell>{children}</MenusLayoutShell>;
}
