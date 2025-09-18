"use client";

import Image from "next/image";
import { cn } from "@/src/lib/cn";
import {
  Package,
  Tag,
  Layers,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";
import { BadgeAllergen } from "@/src/components/ui/BadgeAllergen";
import { type AllergenCode } from "@/src/lib/i18n";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

export type ProductStatus = "ok" | "warning";

export type ProductCardProps = {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: ProductStatus;
  currency?: string;
  thumbnailSrc?: string;
  onClick?: () => void;
  className?: string;
  rightSlot?: React.ReactNode;
  labels?: AllergenCode[];
};

export function ProductCard({
  name,
  category,
  stock,
  price,
  status,
  currency = "€",
  thumbnailSrc,
  onClick,
  className,
  rightSlot,
  labels = [],
}: ProductCardProps) {
  const productDict = useScopedI18n("productCard");
  const isOk = status === "ok";

  return (
    <article
      className={cn(
        "card animate-fade-in hover:shadow-mdx transition-shadow cursor-pointer",
        className
      )}
      onClick={onClick}
      role="button"
      aria-label={`${productDict.ariaPrefix} ${name}`}
    >
      <div className="card-content space-y-3">
        {/* Top row: thumbnail + actions */}
        <div className="flex items-start gap-3">
          {/* Thumb */}
          <div className="shrink-0">
            {thumbnailSrc ? (
              <Image
                src={thumbnailSrc}
                alt={name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-md object-cover shadow-smx"
              />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-md bg-[color-mix(in_oklab,var(--text-primary)_6%,transparent)]">
                <Package className="icon-lg text-[var(--text-secondary)]" />
              </div>
            )}
          </div>
          {/* Título + categoria */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold truncate">{name}</h3>
            <p className="caption flex items-center gap-1 truncate">
              <Tag className="icon-sm" />
              {category}
            </p>
          </div>

          {/* Ações à direita */}
          <div className="shrink-0 -mr-1">
            {rightSlot ? (
              rightSlot
            ) : (
              <button
                type="button"
                className="btn btn-ghost p-1 h-auto"
                aria-label={productDict.moreActions}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="icon-md" />
              </button>
            )}
          </div>
        </div>

        {/* Main metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="caption">{productDict.stockLabel}</p>
            <p className="text-sm flex items-center gap-1">
              <Layers className="icon-sm text-[var(--text-secondary)]" />
              <span className="font-medium">{stock}</span>
              <span className="text-[var(--text-secondary)]">{productDict.unitLabel}</span>
            </p>
          </div>
          <div>
            <p className="caption">{productDict.priceLabel}</p>
            <p className="text-sm font-medium">
              {currency} {price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Status + Labels */}
        <div className="flex items-center justify-between">
          {isOk ? (
            <span className="badge badge-success inline-flex items-center gap-1">
              <CheckCircle2 className="icon-sm" /> {productDict.statusOk}
            </span>
          ) : (
            <span className="badge badge-warning inline-flex items-center gap-1">
              <AlertTriangle className="icon-sm" /> {productDict.statusWarning}
            </span>
          )}

          {/* Allergen badges */}
          <div className="flex flex-wrap justify-end gap-2">
            {labels.map((label) => (
              <BadgeAllergen key={label} code={label} showLabel={false} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
