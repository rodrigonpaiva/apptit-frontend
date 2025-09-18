"use client";

import { useMemo } from "react";

export type InventorySummary = {
  ingredientId: string;
  availableQuantity: number;
  unit?: string;
};

const MOCK_SUMMARY: InventorySummary[] = [
  { ingredientId: "oat", availableQuantity: 18, unit: "kg" },
  { ingredientId: "citrus", availableQuantity: 10, unit: "kg" },
  { ingredientId: "seeds", availableQuantity: 1, unit: "kg" },
  { ingredientId: "egg", availableQuantity: 220, unit: "units" },
  { ingredientId: "spinach", availableQuantity: 4, unit: "kg" },
  { ingredientId: "feta", availableQuantity: 2, unit: "kg" },
  { ingredientId: "tomato", availableQuantity: 12, unit: "kg" },
  { ingredientId: "basil", availableQuantity: 400, unit: "g" },
  { ingredientId: "vinaigrette", availableQuantity: 6, unit: "L" },
  { ingredientId: "chicken", availableQuantity: 55, unit: "kg" },
  { ingredientId: "root-veg", availableQuantity: 20, unit: "kg" },
  { ingredientId: "thyme", availableQuantity: 400, unit: "g" },
  { ingredientId: "rice", availableQuantity: 18, unit: "kg" },
  { ingredientId: "mussels", availableQuantity: 16, unit: "kg" },
  { ingredientId: "prawns", availableQuantity: 8, unit: "kg" },
];

export function useInventorySummary(): InventorySummary[] {
  return useMemo(() => MOCK_SUMMARY, []);
}
