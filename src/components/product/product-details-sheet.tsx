"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Info } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { BadgeAllergen } from "@/src/components/ui/BadgeAllergen";
import {
  type ProductDetails,
  type ProductEcoScore,
} from "@/src/graphql/product";
import { type AllergenCode, type CategoryCode } from "@/src/lib/i18n";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

const ECO_SCORE_COLORS: Record<ProductEcoScore, string> = {
  A: "bg-green-100 text-green-800 border-green-200",
  B: "bg-emerald-100 text-emerald-800 border-emerald-200",
  C: "bg-yellow-100 text-yellow-900 border-yellow-200",
  D: "bg-orange-100 text-orange-900 border-orange-200",
  E: "bg-red-100 text-red-900 border-red-200",
};

function formatDateTime(value: string) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return "";
  }
}

export type ProductDetailsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDetails | null;
  loading?: boolean;
  title?: string;
  sku?: string;
};

export function ProductDetailsSheet({
  open,
  onOpenChange,
  product,
  loading = false,
  title,
  sku,
}: ProductDetailsSheetProps) {
  const [mounted, setMounted] = useState(false);
  const productDict = useScopedI18n("productDetails");
  const categoriesDict = useScopedI18n("categories");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const allergens: AllergenCode[] = useMemo(
    () => product?.allergens ?? [],
    [product?.allergens]
  );

  const categoryLabel = useMemo(() => {
    if (!product) {
      return "";
    }
    return categoriesDict[product.category as CategoryCode];
  }, [product, categoriesDict]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div aria-hidden={!open} className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={productDict.title}
        className="relative h-full w-full max-w-xl translate-x-0 overflow-y-auto bg-white shadow-xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-muted)] bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {product?.name ?? title ?? productDict.title}
            </h2>
            {product?.sku || sku ? (
              <p className="text-sm text-[var(--text-secondary)]">
                {productDict.skuLabel}: {product?.sku ?? sku}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            aria-label={productDict.close}
            onClick={() => onOpenChange(false)}
            className="h-9 w-9 p-0 text-[var(--text-secondary)]"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="space-y-6 px-6 py-6">
          {loading ? (
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-100" />
              <div className="space-y-2">
                <div className="h-5 w-1/2 rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-16 rounded-xl bg-gray-100" />
                ))}
              </div>
            </div>
          ) : product ? (
            <>
              <div className="overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-white">
                {product.thumbnailSrc ? (
                  <Image
                    src={product.thumbnailSrc}
                    alt={product.name}
                    width={960}
                    height={540}
                    className="h-60 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center bg-[color-mix(in_oklab,var(--brand-primary)_12%,white)]">
                    <Info className="h-12 w-12 text-[var(--brand-primary)]" />
                  </div>
                )}
              </div>

              <section aria-labelledby="product-overview" className="space-y-4">
                <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--card-bg)] p-4 shadow-smx">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="caption text-[var(--text-secondary)]">
                        {productDict.barcodeLabel}
                      </dt>
                      <dd className="text-sm font-medium text-[var(--text-primary)]">
                        {product.barcode}
                      </dd>
                    </div>
                    <div>
                      <dt className="caption text-[var(--text-secondary)]">
                        {productDict.categoryLabel}
                      </dt>
                      <dd className="text-sm font-medium text-[var(--text-primary)]">
                        {categoryLabel}
                      </dd>
                    </div>
                    <div>
                      <dt className="caption text-[var(--text-secondary)]">
                        {productDict.stockLabel}
                      </dt>
                      <dd className="text-sm font-medium text-[var(--text-primary)]">
                        {product.stock} {product.unit}
                      </dd>
                    </div>
                    {product.reorderPoint !== undefined ? (
                      <div>
                        <dt className="caption text-[var(--text-secondary)]">
                          {productDict.reorderPointLabel}
                        </dt>
                        <dd className="text-sm font-medium text-[var(--text-primary)]">
                          {product.reorderPoint} {product.unit}
                        </dd>
                      </div>
                    ) : null}
                    {product.supplier ? (
                      <div>
                        <dt className="caption text-[var(--text-secondary)]">
                          {productDict.supplierLabel}
                        </dt>
                        <dd className="text-sm font-medium text-[var(--text-primary)]">
                          {product.supplier}
                        </dd>
                      </div>
                    ) : null}
                    {product.location ? (
                      <div>
                        <dt className="caption text-[var(--text-secondary)]">
                          {productDict.locationLabel}
                        </dt>
                        <dd className="text-sm font-medium text-[var(--text-primary)]">
                          {product.location}
                        </dd>
                      </div>
                    ) : null}
                    {product.updatedAt ? (
                      <div className="sm:col-span-2">
                        <dt className="caption text-[var(--text-secondary)]">
                          {productDict.updatedAtLabel}
                        </dt>
                        <dd className="text-sm text-[var(--text-secondary)]">
                          {formatDateTime(product.updatedAt)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>

                <p className="text-sm text-[var(--text-secondary)]">
                  {product.description}
                </p>
              </section>

              <section aria-labelledby="product-eco" className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {productDict.ecoScoreLabel}
                  </h3>
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-lg font-semibold ${ECO_SCORE_COLORS[product.ecoScore]}`}
                    aria-label={`${productDict.ecoScoreLabel} ${product.ecoScore}`}
                  >
                    {product.ecoScore}
                  </span>
                </div>
              </section>

              <section aria-labelledby="product-allergens" className="space-y-3">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {productDict.allergensLabel}
                </h3>
                {allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((code) => (
                      <BadgeAllergen key={code} code={code} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {productDict.allergensNone}
                  </p>
                )}
              </section>
            </>
          ) : (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 text-center text-[var(--text-secondary)]">
              <Info className="h-10 w-10" />
              <p className="text-sm font-medium">{productDict.title}</p>
            </div>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}
