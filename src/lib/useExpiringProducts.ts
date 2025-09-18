"use client";

import { useMemo } from "react";

export type ExpiringProduct = {
  ingredientId: string;
  daysUntilExpiry: number;
};

const MOCK_EXPIRING: ExpiringProduct[] = [
  { ingredientId: "citrus", daysUntilExpiry: 2 },
  { ingredientId: "spinach", daysUntilExpiry: 1 },
  { ingredientId: "mussels", daysUntilExpiry: 3 },
];

export function useExpiringProducts(days = 3): ExpiringProduct[] {
  return useMemo(() => MOCK_EXPIRING.filter((item) => item.daysUntilExpiry <= days), [days]);
}
