"use client";

import { useEffect, useMemo, useState } from "react";
import { type AllergenCode, type CategoryCode } from "@/src/lib/i18n";

export type ProductEcoScore = "A" | "B" | "C" | "D" | "E";

export type ProductDetails = {
  id: string;
  name: string;
  barcode: string;
  sku: string;
  description: string;
  category: CategoryCode;
  stock: number;
  unit: string;
  allergens: AllergenCode[];
  ecoScore: ProductEcoScore;
  supplier?: string;
  location?: string;
  reorderPoint?: number;
  thumbnailSrc?: string;
  updatedAt: string;
};

const MOCK_PRODUCTS_BY_BARCODE: Record<string, ProductDetails> = {
  "3770001234560": {
    id: "prod-001",
    name: "Organic Tomatoes",
    barcode: "3770001234560",
    sku: "SKU-ORG-TOM-1",
    description:
      "Fresh organic tomatoes sourced from local farms, ideal for salads and sauces.",
    category: "produce",
    stock: 120,
    unit: "kg",
    allergens: ["vegan"],
    ecoScore: "A",
    supplier: "Fresh Farms",
    location: "Cold room A",
    reorderPoint: 40,
    thumbnailSrc: "/images/inventory/tomatoes.jpg",
    updatedAt: new Date().toISOString(),
  },
  "3270123456789": {
    id: "prod-004",
    name: "Whole Wheat Penne",
    barcode: "3270123456789",
    sku: "SKU-PENNE-4",
    description: "Italian whole wheat penne pasta perfect for high-fiber meals.",
    category: "dry",
    stock: 320,
    unit: "kg",
    allergens: ["gluten"],
    ecoScore: "A",
    supplier: "Pasta Italia",
    location: "Dry storage",
    reorderPoint: 120,
    thumbnailSrc: "/images/inventory/pasta.jpg",
    updatedAt: new Date().toISOString(),
  },
  "3210987654321": {
    id: "prod-009",
    name: "Chocolate Mousse",
    barcode: "3210987654321",
    sku: "SKU-MOUSSE-9",
    description:
      "House-made chocolate mousse prepared daily with premium cocoa and cream.",
    category: "prepared",
    stock: 28,
    unit: "portion",
    allergens: ["egg", "lactose"],
    ecoScore: "C",
    supplier: "Dessert Lab",
    location: "Pastry fridge",
    reorderPoint: 40,
    thumbnailSrc: "/images/inventory/mousse.jpg",
    updatedAt: new Date().toISOString(),
  },
};

function simulateProductRequest(barcode: string): Promise<ProductDetails | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS_BY_BARCODE[barcode] ?? null);
    }, 150);
  });
}

export async function getProductByBarcode(barcode: string): Promise<ProductDetails | null> {
  return simulateProductRequest(barcode);
}

export function useGetProductByBarcode(barcode?: string) {
  const [data, setData] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!barcode) {
      setData(null);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);

    simulateProductRequest(barcode).then((result) => {
      if (!isMounted) {
        return;
      }

      setData(result);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [barcode]);

  const hasData = useMemo(() => Boolean(data), [data]);

  return {
    data,
    loading,
    hasData,
  };
}

export type UseGetProductByBarcodeReturn = ReturnType<typeof useGetProductByBarcode>;
