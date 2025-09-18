"use client";

import { ProductCard, type ProductCardProps } from "./product-card";
import { cn } from "@/src/lib/cn";

export type ProductListGridProps = {
  products: ProductCardProps[];
  className?: string;
  onItemClick?: (id: string) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  skeletonCount?: number;
};

export function ProductListGrid({
  products,
  className,
  onItemClick,
  emptyState,
  loading,
  skeletonCount = 6,
}: ProductListGridProps) {
  // Grid responsiva 1/2/3/4 colunas
  return (
    <section className={cn(className)}>
      <h2 className="text-lg font-semibold mb-3">Produtos</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="card">
              <div className="card-content">
                <div className="skeleton h-14 w-14 rounded-md mb-3" />
                <div className="skeleton h-4 w-3/4 mb-2" />
                <div className="skeleton h-3 w-1/2 mb-4" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
                <div className="skeleton h-6 w-24 mt-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        emptyState ?? (
          <div className="card">
            <div className="card-content">
              <p className="text-sm">
                Nenhum produto encontrado. Ajuste os filtros ou crie um novo item.
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              {...p}
              onClick={() => onItemClick?.(p.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}