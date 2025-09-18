"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  Inbox,
  LogOutIcon,
  PackageIcon,
  TruckElectricIcon,
  Warehouse,
  Menu,
  X,
} from "lucide-react";

// Ajuste ces chemins selon ton repo
import Navbar from "@/src/components/dashboard/navbar";
import { ModuleHeader } from "@/src/components/dashboard/module-header";
import { KpiCard } from "@/src/components/dashboard/kpi-card";
import { ProductListGrid } from "@/src/components/dashboard/product/product-list-grid";

export default function GestionProduits() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const produits = [
    { id: "1", name: "Tomates bio", category: "Légumes", stock: 120, price: 2.3, status: "ok", labels: ["vegan", "gluten"] },
    { id: "2", name: "Poulet fermier", category: "Viandes", stock: 42, price: 7.5, status: "ok", labels: ["gluten"] },
    { id: "3", name: "Saumon frais", category: "Poissons", stock: 8, price: 12.9, status: "warning", labels: ["poison"] },
    { id: "4", name: "Pâtes penne", category: "Épicerie", stock: 320, price: 1.1, status: "ok", labels: ["gluten"] },
  ];


  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      {/* Barre supérieure mobile */}
      <div className="navbar md:hidden">
        <div className="navbar-inner">
          <button
            type="button"
            className="btn btn-ghost"
            aria-label="Ouvrir le menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="icon-lg" />
          </button>

          <div className="flex-1 text-center">
            <span className="font-semibold">Gestion des Produits</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="#" className="text-[var(--text-secondary)] hover:opacity-80" aria-label="Boîte de réception">
              <Inbox className="icon-lg" />
            </Link>
            <Link href="#" className="text-[var(--text-secondary)] hover:opacity-80" aria-label="Déconnexion">
              <LogOutIcon className="icon-lg" />
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px]">
        <div className="flex">
          {/* Sidebar – fixe en desktop, off-canvas en mobile */}
          <aside className="hidden md:block sidebar border-0 shrink-0">
            <Navbar />
          </aside>

          {/* Off-canvas mobile */}
          {sidebarOpen && (
            <div className="modal" role="dialog" aria-modal="true">
              <div
                className="modal-backdrop"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="modal-panel !max-w-[320px] p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)]">
                  <span className="font-semibold">Menu</span>
                  <button
                    className="btn btn-ghost"
                    aria-label="Fermer le menu"
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

          {/* Colonne contenu */}
          <main className="flex-1 w-full">
            {/* Header + actions (desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4">
              <div className="col-span-9">
                <ModuleHeader
                  userName="Jean Dupont"
                  tenantName="Entreprise XYZ"
                  moduleName="Gestion des Produits"
                  subtitle="Bienvenue sur votre espace"
                  avatarSrc="/images/avatar-placeholder.png"
                />
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <nav className="flex gap-4">
                  <Link href="#" className="text-[var(--text-secondary)] hover:opacity-80" aria-label="Boîte de réception">
                    <Inbox className="icon-lg" />
                  </Link>
                  <Link href="#" className="text-[var(--text-secondary)] hover:opacity-80" aria-label="Déconnexion">
                    <LogOutIcon className="icon-lg" />
                  </Link>
                </nav>
              </div>
            </div>

            {/* Header (mobile) */}
            <div className="md:hidden p-4">
              <ModuleHeader
                userName="Jean Dupont"
                tenantName="Entreprise XYZ"
                moduleName="Gestion des Produits"
                subtitle="Bienvenue sur votre espace"
                avatarSrc="/images/avatar-placeholder.png"
              />
            </div>

            {/* KPIs */}
            <section className="p-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard
                  title="Produits en stock"
                  value={1240}
                  deltaPct={8.5}
                  deltaLabel="vs 3 derniers mois"
                  icon={<Warehouse size={36} />}
                  trend={[30, 40, 35, 50, 55, 60, 70, 75, 80, 90, 100]}
                />

                <KpiCard
                  title="Commandes ce mois"
                  value={385}
                  deltaPct={-4.2}
                  deltaLabel="vs 3 derniers mois"
                  icon={<TruckElectricIcon size={36} />}
                  trend={[70, 68, 66, 64, 63, 62, 60, 61, 60, 59, 58, 56]}
                />

                <KpiCard
                  title="Valeur du stock"
                  value={154320}
                  valuePrefix="€"
                  deltaPct={3.1}
                  deltaLabel="vs 3 derniers mois"
                  icon={<PackageIcon size={36} />}
                  trend={[40, 43, 47, 50, 51, 55, 57, 60, 62, 64, 66, 67]}
                />
              </div>
            </section>

            {/* Placeholder contenu principal (table, filtres, etc.) */}
            <section className="">
              <div className="widget shadow-none border-0">
                <div className="skeleton h-12 mt-2 rounded"></div>
                <ProductListGrid products={produits} className="shadow-none border-0" />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}