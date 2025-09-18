"use client";

import Image from "next/image";
import { cn } from "@/src/lib/cn";
import { PackageCheckIcon } from 'lucide-react'

type ModuleHeaderProps = {
  userName: string;
  tenantName: string;
  moduleName?: string;
  subtitle?: string;
  avatarSrc?: string; // ex: "/images/user-avatar.jpg"
  className?: string;
};

export function ModuleHeader({
  userName,
  tenantName,
  moduleName = "Gestion des Produits",
  subtitle = "Bienvenue sur votre espace",
  avatarSrc = "/images/avatar-placeholder.png",
  className,
}: ModuleHeaderProps) {
  return (
    <header className={cn("card animate-scale-in border-0 m-0 p-0 ", className)}>
      <div className="card-content">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={avatarSrc}
              alt={userName}
              width={56}
              height={56}
              className="rounded-full shadow-smx"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="caption">{subtitle}</p>
            <h1 className="text-xxl font-semibold leading-tight">
              Bonjour, {userName}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="badge"><PackageCheckIcon size={18} /> {moduleName}</span>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="">{tenantName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}