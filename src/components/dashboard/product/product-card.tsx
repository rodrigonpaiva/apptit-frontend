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
  Leaf,
  Skull,
  Wheat,
} from "lucide-react";

export type ProductStatus = "ok" | "warning";

export type ProductLabel = "vegan" | "gluten" | "poison";

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
  labels?: ProductLabel[];
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
  const isOk = status === "ok";

  const renderLabelIcon = (label: ProductLabel) => {
    switch (label) {
      case "vegan":
        return (
          <>
          <Leaf
            key={label}
            className="icon-sm text-green-600"
          />
          </>
          
        );
      case "gluten":
        return (
          <Wheat
            key={label}
            className="icon-sm text-yellow-600"
          />
        );
      case "poison":
        return (
          <Skull
            key={label}
            className="icon-sm text-red-600"
          />
        );
      default:
        return null;
    }
  };

  return (
    <article
      className={cn(
        "card animate-fade-in hover:shadow-mdx transition-shadow cursor-pointer",
        className
      )}
      onClick={onClick}
      role="button"
      aria-label={`Produto ${name}`}
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
                className="rounded-md object-cover shadow-smx"
              />
            ) : (
              <div className="w-14 h-14 rounded-md bg-[color-mix(in_oklab,var(--text-primary)_6%,transparent)] grid place-items-center">
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
                aria-label="Mais ações"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="icon-md" />
              </button>
            )}
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="caption">Stock</p>
            <p className="text-sm flex items-center gap-1">
              <Layers className="icon-sm text-[var(--text-secondary)]" />
              <span className="font-medium">{stock}</span>
              <span className="text-[var(--text-secondary)]">u</span>
            </p>
          </div>
          <div>
            <p className="caption">Price</p>
            <p className="text-sm font-medium">
              {currency} {price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Status + Labels */}
        <div className="flex items-center justify-between">
          {isOk ? (
            <span className="badge badge-success inline-flex items-center gap-1">
              <CheckCircle2 className="icon-sm" /> OK
            </span>
          ) : (
            <span className="badge badge-warning inline-flex items-center gap-1">
              <AlertTriangle className="icon-sm" /> Verifier
            </span>
          )}

          {/* Ícones de labels */}
          <div className="flex items-center gap-2">
            {labels.map((l) => renderLabelIcon(l))}
          </div>
        </div>
      </div>
    </article>
  );
}