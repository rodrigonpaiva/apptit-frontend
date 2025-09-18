"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { type AllergenCode, type CategoryCode } from "@/src/lib/i18n";

type InventoryStatus = "in_stock" | "low_stock" | "critical";

export type InventoryEcoScore = "A" | "B" | "C" | "D" | "E";

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: CategoryCode;
  stock: number;
  unit: string;
  unitPrice: number;
  currency: string;
  status: InventoryStatus;
  allergens: AllergenCode[];
  expirationDate: string;
  reorderPoint: number;
  ecoScore: InventoryEcoScore;
  thumbnailSrc?: string;
  supplier?: string;
  location?: string;
};

export type InventoryFilters = {
  search: string;
  category: CategoryCode | "all";
  allergens: AllergenCode[];
  expiration: "all" | "soon";
  page: number;
  pageSize: number;
};

export type InventorySummary = {
  expiringSoon: number;
  lowStock: number;
  healthy: number;
};

export type InventoryQueryResult = {
  items: InventoryItem[];
  total: number;
  totalPages: number;
  summary: InventorySummary;
};

const EXPIRATION_SOON_DAYS = 7;

const DEFAULT_FILTERS: InventoryFilters = {
  search: "",
  category: "all",
  allergens: [],
  expiration: "all",
  page: 1,
  pageSize: 12,
};

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "prod-001",
    name: "Organic Tomatoes",
    sku: "SKU-ORG-TOM-1",
    barcode: "3770001234560",
    category: "produce",
    stock: 120,
    unit: "kg",
    unitPrice: 2.3,
    currency: "€",
    status: "in_stock",
    allergens: ["vegan"],
    expirationDate: daysFromNow(5),
    reorderPoint: 40,
    ecoScore: "A",
    thumbnailSrc: "/images/inventory/tomatoes.jpg",
    supplier: "Fresh Farms",
    location: "Cold room A",
  },
  {
    id: "prod-002",
    name: "Free-range Chicken Breast",
    sku: "SKU-CHICK-2",
    barcode: "3760012345004",
    category: "protein",
    stock: 42,
    unit: "kg",
    unitPrice: 7.5,
    currency: "€",
    status: "low_stock",
    allergens: ["soy"],
    expirationDate: daysFromNow(3),
    reorderPoint: 60,
    ecoScore: "B",
    thumbnailSrc: "/images/inventory/chicken.jpg",
    supplier: "Poultry Co-op",
    location: "Cold room B",
  },
  {
    id: "prod-003",
    name: "Smoked Salmon Fillet",
    sku: "SKU-SALM-3",
    barcode: "3760012345011",
    category: "protein",
    stock: 18,
    unit: "kg",
    unitPrice: 12.9,
    currency: "€",
    status: "low_stock",
    allergens: ["fish"],
    expirationDate: daysFromNow(4),
    reorderPoint: 25,
    ecoScore: "C",
    thumbnailSrc: "/images/inventory/salmon.jpg",
    supplier: "Nordic Seas",
    location: "Cold room C",
  },
  {
    id: "prod-004",
    name: "Whole Wheat Penne",
    sku: "SKU-PENNE-4",
    barcode: "3270123456789",
    category: "dry",
    stock: 320,
    unit: "kg",
    unitPrice: 1.1,
    currency: "€",
    status: "in_stock",
    allergens: ["gluten"],
    expirationDate: daysFromNow(180),
    reorderPoint: 120,
    ecoScore: "A",
    thumbnailSrc: "/images/inventory/pasta.jpg",
    supplier: "Pasta Italia",
    location: "Dry storage",
  },
  {
    id: "prod-005",
    name: "Fresh Mozzarella",
    sku: "SKU-MOZZ-5",
    barcode: "3367009876543",
    category: "dairy",
    stock: 56,
    unit: "kg",
    unitPrice: 5.2,
    currency: "€",
    status: "in_stock",
    allergens: ["lactose"],
    expirationDate: daysFromNow(6),
    reorderPoint: 30,
    ecoScore: "B",
    thumbnailSrc: "/images/inventory/mozzarella.jpg",
    supplier: "Casa Latte",
    location: "Cold room A",
  },
  {
    id: "prod-006",
    name: "Almond Milk",
    sku: "SKU-ALMD-6",
    barcode: "3545612345678",
    category: "beverage",
    stock: 210,
    unit: "L",
    unitPrice: 2.1,
    currency: "€",
    status: "in_stock",
    allergens: ["nuts"],
    expirationDate: daysFromNow(40),
    reorderPoint: 80,
    ecoScore: "A",
    thumbnailSrc: "/images/inventory/almond-milk.jpg",
    supplier: "Green Drinks",
    location: "Dry storage",
  },
  {
    id: "prod-007",
    name: "Egg Tagliatelle",
    sku: "SKU-TAGL-7",
    barcode: "3456123498765",
    category: "dry",
    stock: 140,
    unit: "kg",
    unitPrice: 1.6,
    currency: "€",
    status: "in_stock",
    allergens: ["gluten", "egg"],
    expirationDate: daysFromNow(90),
    reorderPoint: 90,
    ecoScore: "B",
    thumbnailSrc: "/images/inventory/tagliatelle.jpg",
    supplier: "Pasta Italia",
    location: "Dry storage",
  },
  {
    id: "prod-008",
    name: "Vegan Basil Pesto",
    sku: "SKU-PESTO-8",
    barcode: "3456123409871",
    category: "condiments",
    stock: 84,
    unit: "kg",
    unitPrice: 4.8,
    currency: "€",
    status: "in_stock",
    allergens: ["nuts", "vegan"],
    expirationDate: daysFromNow(35),
    reorderPoint: 50,
    ecoScore: "A",
    thumbnailSrc: "/images/inventory/pesto.jpg",
    supplier: "Green Sauces",
    location: "Dry storage",
  },
  {
    id: "prod-009",
    name: "Chocolate Mousse",
    sku: "SKU-MOUSSE-9",
    barcode: "3210987654321",
    category: "prepared",
    stock: 28,
    unit: "portion",
    unitPrice: 3.2,
    currency: "€",
    status: "critical",
    allergens: ["egg", "lactose"],
    expirationDate: daysFromNow(2),
    reorderPoint: 40,
    ecoScore: "C",
    thumbnailSrc: "/images/inventory/mousse.jpg",
    supplier: "Dessert Lab",
    location: "Pastry fridge",
  },
  {
    id: "prod-010",
    name: "Seafood Bisque",
    sku: "SKU-BISQUE-10",
    barcode: "3098765432109",
    category: "prepared",
    stock: 12,
    unit: "L",
    unitPrice: 6.4,
    currency: "€",
    status: "critical",
    allergens: ["shellfish", "fish"],
    expirationDate: daysFromNow(1),
    reorderPoint: 30,
    ecoScore: "D",
    thumbnailSrc: "/images/inventory/bisque.jpg",
    supplier: "Ocean Kitchen",
    location: "Cold room C",
  },
  {
    id: "prod-011",
    name: "Tofu Blocks",
    sku: "SKU-TOFU-11",
    barcode: "3001234509876",
    category: "protein",
    stock: 190,
    unit: "kg",
    unitPrice: 3.4,
    currency: "€",
    status: "in_stock",
    allergens: ["soy", "vegan"],
    expirationDate: daysFromNow(14),
    reorderPoint: 70,
    ecoScore: "A",
    thumbnailSrc: "/images/inventory/tofu.jpg",
    supplier: "Plant Foods",
    location: "Cold room B",
  },
];

const AVAILABLE_CATEGORIES = Array.from(
  new Set(MOCK_INVENTORY.map((item) => item.category))
) as CategoryCode[];

const AVAILABLE_ALLERGENS = Array.from(
  new Set(MOCK_INVENTORY.flatMap((item) => item.allergens))
) as AllergenCode[];

function matchesSearch(item: InventoryItem, query: string): boolean {
  if (!query) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return (
    item.name.toLowerCase().includes(normalized) ||
    item.sku.toLowerCase().includes(normalized)
  );
}

function matchesCategory(item: InventoryItem, category: InventoryFilters["category"]): boolean {
  return category === "all" || item.category === category;
}

function matchesAllergens(item: InventoryItem, allergens: AllergenCode[]): boolean {
  if (allergens.length === 0) {
    return true;
  }

  return allergens.every((code) => item.allergens.includes(code));
}

function isExpiringSoon(expirationDate: string): boolean {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffInMs = expiry.getTime() - now.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays <= EXPIRATION_SOON_DAYS && diffInDays >= 0;
}

function matchesExpiration(item: InventoryItem, expiration: InventoryFilters["expiration"]): boolean {
  if (expiration === "all") {
    return true;
  }

  return isExpiringSoon(item.expirationDate);
}

function paginate<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function computeInventory(filters: InventoryFilters): InventoryQueryResult {
  const filtered = MOCK_INVENTORY.filter(
    (item) =>
      matchesSearch(item, filters.search) &&
      matchesCategory(item, filters.category) &&
      matchesAllergens(item, filters.allergens) &&
      matchesExpiration(item, filters.expiration)
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const items = paginate(filtered, filters.page, filters.pageSize);

  let expiringSoon = 0;
  let lowStock = 0;
  let healthy = 0;

  filtered.forEach((item) => {
    const expSoon = isExpiringSoon(item.expirationDate);
    const low = item.stock <= item.reorderPoint;

    if (expSoon) {
      expiringSoon += 1;
    }

    if (low) {
      lowStock += 1;
    }

    if (!expSoon && !low) {
      healthy += 1;
    }
  });

  return {
    items,
    total,
    totalPages,
    summary: {
      expiringSoon,
      lowStock,
      healthy,
    },
  };
}

function simulateRequest(filters: InventoryFilters): Promise<InventoryQueryResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(computeInventory(filters));
    }, 150);
  });
}

export async function getInventory(
  params: Partial<InventoryFilters> = {}
): Promise<InventoryQueryResult> {
  const filters = { ...DEFAULT_FILTERS, ...params };
  return simulateRequest(filters);
}

export function useGetInventory(initialFilters?: Partial<InventoryFilters>) {
  const [filters, setFilters] = useState<InventoryFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [data, setData] = useState<InventoryQueryResult>(() =>
    computeInventory({ ...DEFAULT_FILTERS, ...initialFilters })
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    simulateRequest(filters).then((result) => {
      if (!isMounted) {
        return;
      }

      if (filters.page > result.totalPages && result.totalPages > 0) {
        setFilters((prev) => ({ ...prev, page: result.totalPages }));
        return;
      }

      setData(result);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateFilters = useCallback(
    (updater: (prev: InventoryFilters) => InventoryFilters) => {
      setFilters((prev) => updater(prev));
    },
    []
  );

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const availableFilters = useMemo(
    () => ({
      categories: AVAILABLE_CATEGORIES,
      allergens: AVAILABLE_ALLERGENS,
    }),
    []
  );

  return {
    filters,
    data,
    loading,
    setFilters: updateFilters,
    setPage,
    setPageSize,
    resetFilters,
    availableFilters,
    expirationSoonDays: EXPIRATION_SOON_DAYS,
  };
}

export type UseGetInventoryReturn = ReturnType<typeof useGetInventory>;
