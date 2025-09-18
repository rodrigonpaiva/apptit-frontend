"use client";

import { useMemo } from "react";

import type { PlannerDish } from "@/src/lib/useMenuPlannerState";

export type SuggestionFilters = {
  allergensToAvoid: string[];
  category?: string;
};

export type SuggestionResult = {
  highStock: PlannerDish[];
  lowStock: PlannerDish[];
};

const MOCK_INVENTORY = [
  {
    dishId: "dish-porridge",
    stockScore: 0.8,
  },
  {
    dishId: "dish-frittata",
    stockScore: 0.4,
  },
  {
    dishId: "dish-salad",
    stockScore: 0.9,
  },
  {
    dishId: "dish-roast-chicken",
    stockScore: 0.3,
  },
  {
    dishId: "dish-paella",
    stockScore: 0.6,
  },
];

export function useSuggestDishesFromInventory(
  dishes: PlannerDish[],
  filters: SuggestionFilters
): SuggestionResult {
  return useMemo(() => {
    const avoid = new Set(filters.allergensToAvoid ?? []);
    const category = filters.category;

    const eligible = dishes.filter((dish) => {
      if (category && dish.category !== category) {
        return false;
      }
      return dish.allergens.every((code) => !avoid.has(code));
    });

    const scored = eligible.map((dish) => {
      const inventoryEntry = MOCK_INVENTORY.find((entry) => entry.dishId === dish.id);
      const stockScore = inventoryEntry ? inventoryEntry.stockScore : 0.5;
      return { dish, stockScore };
    });

    const highStock = scored
      .filter((item) => item.stockScore >= 0.6)
      .sort((a, b) => b.stockScore - a.stockScore)
      .map((item) => item.dish);

    const lowStock = scored
      .filter((item) => item.stockScore < 0.6)
      .sort((a, b) => b.stockScore - a.stockScore)
      .map((item) => item.dish);

    return { highStock, lowStock };
  }, [dishes, filters.allergensToAvoid, filters.category]);
}
