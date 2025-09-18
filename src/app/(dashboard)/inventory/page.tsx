"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { cn } from "@/src/lib/cn";
import { type AllergenCode } from "@/src/lib/i18n";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import { ProductListGrid } from "@/src/components/product/product-list-grid";
import {
  useGetInventory,
  type InventoryFilters,
  type InventoryItem,
} from "@/src/graphql/inventory";
import { BadgeAllergen } from "@/src/components/ui/BadgeAllergen";
import { useGetProductByBarcode } from "@/src/graphql/product";
import { ProductDetailsSheet } from "@/src/components/product/product-details-sheet";
import Navbar from "@/src/components/dashboard/navbar";
import { ModuleHeader } from "@/src/components/dashboard/module-header";
import { Inbox, LogOutIcon, Menu, X } from "lucide-react";

export default function InventoryPage() {
  const inventoryDict = useScopedI18n("inventory");
  const commonDict = useScopedI18n("common");
  const categoriesDict = useScopedI18n("categories");
  const allergensDict = useScopedI18n("allergens");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    filters,
    data,
    loading,
    setFilters,
    setPage,
    resetFilters,
    availableFilters,
    expirationSoonDays,
  } = useGetInventory();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [selectedInventorySnapshot, setSelectedInventorySnapshot] =
    useState<InventoryItem | null>(null);

  const shouldFetchDetails = isSheetOpen && selectedBarcode ? selectedBarcode : undefined;
  const {
    data: productDetails,
    loading: productLoading,
  } = useGetProductByBarcode(shouldFetchDetails);

  const hasFiltersApplied =
    filters.search.trim().length > 0 ||
    filters.category !== "all" ||
    filters.allergens.length > 0 ||
    filters.expiration === "soon";

  const products = useMemo(() => {
    return data.items.map((item) => ({
      id: item.id,
      name: item.name,
      category: categoriesDict[item.category],
      stock: item.stock,
      price: item.unitPrice,
      status: item.status === "in_stock" ? "ok" : "warning",
      currency: item.currency,
      thumbnailSrc: item.thumbnailSrc,
      labels: item.allergens,
    }));
  }, [data.items, categoriesDict]);

  const handleProductClick = useCallback(
    (id: string) => {
      const matched = data.items.find((item) => item.id === id);
      if (!matched) {
        return;
      }
      setSelectedBarcode(matched.barcode);
      setSelectedInventorySnapshot(matched);
      setIsSheetOpen(true);
    },
    [data.items]
  );

  const handleSheetOpenChange = useCallback((next: boolean) => {
    if (!next) {
      setIsSheetOpen(false);
      setSelectedBarcode(null);
      setSelectedInventorySnapshot(null);
      return;
    }
    setIsSheetOpen(true);
  }, []);

  const rangeStart = data.total === 0 ? 0 : (filters.page - 1) * filters.pageSize + 1;
  const rangeEnd = data.total === 0 ? 0 : Math.min(data.total, filters.page * filters.pageSize);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const onCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as InventoryFilters["category"];
    setFilters((prev) => ({ ...prev, category: value, page: 1 }));
  };

  const toggleAllergen = (code: AllergenCode) => {
    setFilters((prev) => {
      const isActive = prev.allergens.includes(code);
      const nextAllergens = isActive
        ? prev.allergens.filter((item) => item !== code)
        : [...prev.allergens, code];

      return { ...prev, allergens: nextAllergens, page: 1 };
    });
  };

  const onExpirationToggle = (checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      expiration: checked ? "soon" : "all",
      page: 1,
    }));
  };

  const goToPreviousPage = () => {
    if (filters.page > 1) {
      setPage(filters.page - 1);
    }
  };

  const goToNextPage = () => {
    if (filters.page < data.totalPages) {
      setPage(filters.page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      {/* Mobile top bar */}
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
            <span className="font-semibold">{inventoryDict.pageTitle}</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href="#"
              className="text-[var(--text-secondary)] hover:opacity-80"
              aria-label="Inbox"
            >
              <Inbox className="icon-lg" />
            </Link>
            <Link
              href="#"
              className="text-[var(--text-secondary)] hover:opacity-80"
              aria-label="Sign out"
            >
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
              <div
                className="modal-backdrop"
                onClick={() => setSidebarOpen(false)}
              />
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
                  tenantName="Company XYZ"
                  moduleName={inventoryDict.pageTitle}
                  subtitle={inventoryDict.pageSubtitle}
                  avatarSrc="/images/avatar-placeholder.png"
                />
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <nav className="flex gap-4">
                  <Link
                    href="#"
                    className="text-[var(--text-secondary)] hover:opacity-80"
                    aria-label="Inbox"
                  >
                    <Inbox className="icon-lg" />
                  </Link>
                  <Link
                    href="#"
                    className="text-[var(--text-secondary)] hover:opacity-80"
                    aria-label="Sign out"
                  >
                    <LogOutIcon className="icon-lg" />
                  </Link>
                </nav>
              </div>
            </div>

            <div className="md:hidden p-4">
              <ModuleHeader
                userName="John Doe"
                tenantName="Company XYZ"
                moduleName={inventoryDict.pageTitle}
                subtitle={inventoryDict.pageSubtitle}
                avatarSrc="/images/avatar-placeholder.png"
              />
            </div>

            <div className="rounded-2xl p-2">
              <p className="text-sm font-semibold text-[var(--text-secondary)]">
                {inventoryDict.summaryTitle}
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <div className="flex-1 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2">
                  <p className="caption text-yellow-800">
                    {inventoryDict.summaryExpiringSoon}
                  </p>
                  <p className="text-xl font-semibold text-yellow-900">
                    {data.summary.expiringSoon}
                  </p>
                </div>
                <div className="flex-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                  <p className="caption text-red-800">
                    {inventoryDict.summaryLowStock}
                  </p>
                  <p className="text-xl font-semibold text-red-900">
                    {data.summary.lowStock}
                  </p>
                </div>
                <div className="flex-1 rounded-xl border border-green-200 bg-green-50 px-3 py-2">
                  <p className="caption text-green-800">
                    {inventoryDict.summaryInStock}
                  </p>
                  <p className="text-xl font-semibold text-green-900">
                    {data.summary.healthy}
                  </p>                    
                </div>
              </div>
              <div className="flex flex-col p-2 gap-2">
                <Checkbox
                  checked={filters.expiration === "soon"}
                    onCheckedChange={(checked) =>
                    onExpirationToggle(Boolean(checked))
                  }
                  label={inventoryDict.expirationSoon}
                />
                <p className="form-help">
                  ({inventoryDict.expirationSoonHelp.replace(
                    "7",
                    String(expirationSoonDays)
                  )})
                </p>
              </div>
            </div>

            <div className="space-y-6 p-4 pt-0">
              <section aria-labelledby="inventory-filters" className="card">
                <div className="card-content space-y-6">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2
                        id="inventory-filters"
                        className="text-lg font-semibold text-[var(--text-primary)]"
                      >
                        {inventoryDict.filtersTitle}
                      </h2>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resetFilters}
                      disabled={!hasFiltersApplied}
                    >
                      {inventoryDict.resetFilters}
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <Input
                        value={filters.search}
                        onChange={onSearchChange}
                        placeholder={inventoryDict.searchPlaceholder}
                        label={commonDict.searchLabel}
                        aria-label={inventoryDict.searchPlaceholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="inventory-category" className="form-label">
                        {inventoryDict.categoryLabel}
                      </label>
                      <select
                        id="inventory-category"
                        value={filters.category}
                        onChange={onCategoryChange}
                        className="input"
                      >
                        <option value="all">{inventoryDict.categoryAll}</option>
                        {availableFilters.categories.map((code) => (
                          <option key={code} value={code}>
                            {categoriesDict[code]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-1">
                    <div>
                      <p className="form-label pb-2">{inventoryDict.allergenLabel}</p>
                      <div className="flex flex-wrap gap-3">
                        {availableFilters.allergens.map((code) => {
                          const isActive = filters.allergens.includes(code);
                          return (
                            <button
                              key={code}
                              type="button"
                              onClick={() => toggleAllergen(code)}
                              aria-pressed={isActive}
                              aria-label={allergensDict[code]}
                              className={cn(
                                "rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]",
                                !isActive && "opacity-70"
                              )}
                            >
                              <BadgeAllergen
                                code={code}
                                className={cn(
                                  "transition-opacity",
                                  !isActive && "border-dashed"
                                )}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <ProductListGrid
                products={products}
                loading={loading}
                onItemClick={handleProductClick}
                emptyState={
                  <div className="card">
                    <div className="card-content space-y-2">
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">
                        {inventoryDict.emptyStateTitle}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {inventoryDict.emptyStateDescription}
                      </p>
                    </div>
                  </div>
                }
              />

              <nav
                aria-label={inventoryDict.paginationLabel}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-[var(--text-secondary)]">
                  {inventoryDict.paginationPage} {filters.page} {commonDict.of} {data.totalPages}
                  {data.total > 0
                    ? ` · ${rangeStart}-${rangeEnd} ${commonDict.of} ${data.total}`
                    : ""}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={goToPreviousPage}
                    disabled={filters.page === 1 || loading}
                  >
                    {commonDict.previous}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={goToNextPage}
                    disabled={filters.page === data.totalPages || loading}
                  >
                    {commonDict.next}
                  </Button>
                </div>
              </nav>
            </div>

            <ProductDetailsSheet
              open={isSheetOpen}
              onOpenChange={handleSheetOpenChange}
              product={productDetails ?? null}
              loading={productLoading}
              title={selectedInventorySnapshot?.name}
              sku={selectedInventorySnapshot?.sku}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
