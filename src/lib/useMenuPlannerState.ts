"use client";

import { useCallback, useMemo, useState } from "react";

import type { MealKey } from "@/src/components/menus/MealSection";
import type { DishBadgeVariant } from "@/src/components/menus/DishBadge";
import { useInventorySummary } from "@/src/lib/useInventorySummary";
import { useExpiringProducts } from "@/src/lib/useExpiringProducts";

export type PlannerDish = {
  id: string;
  name: string;
  description?: string;
  badges?: DishBadgeVariant[];
  category: string;
  allergens: string[];
  ingredients: Array<{ id: string; name: string; quantity: string; unit?: string }>;
};

export type PlannerMeal = {
  meal: MealKey;
  note?: string;
  dishes: PlannerDish[];
};

export type PlannerDay = {
  id: string;
  dayKey: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  meals: PlannerMeal[];
};

export type PlannerTemplate = {
  id: string;
  name: string;
  description?: string;
};

export type ExpiringIngredientAlert = {
  ingredientId: string;
  daysUntilExpiry: number;
  dishIds: string[];
};

export type IngredientAvailability = {
  id: string;
  name: string;
  required: number;
  unit?: string;
  inStock?: number;
  missing: number;
};

export type UseMenuPlannerStateResult = {
  days: PlannerDay[];
  availableTemplates: PlannerTemplate[];
  dishLibrary: PlannerDish[];
  duplicateDay: (dayId: string) => void;
  applyTemplate: (templateId: string) => void;
  exportWeek: () => void;
  moveDishToMeal: (dayId: string, meal: MealKey, dish: PlannerDish) => void;
  removeDishFromMeal: (dayId: string, meal: MealKey, dishId: string) => void;
  ingredientSummary: IngredientAvailability[];
  expiringAlerts: ExpiringIngredientAlert[];
};

const MOCK_DISH_LIBRARY: PlannerDish[] = [
  {
    id: "dish-porridge",
    name: "Steel-cut oat porridge",
    description: "Citrus compote, toasted seeds",
    badges: ["vegetarian", "lactoseFree"],
    category: "breakfast",
    allergens: ["nuts"],
    ingredients: [
      { id: "oat", name: "Oats", quantity: "25", unit: "kg" },
      { id: "citrus", name: "Citrus mix", quantity: "8", unit: "kg" },
      { id: "seeds", name: "Toasted seeds", quantity: "2", unit: "kg" },
    ],
  },
  {
    id: "dish-frittata",
    name: "Spinach & feta frittata",
    description: "Free-range eggs, roasted peppers",
    badges: ["vegetarian"],
    category: "breakfast",
    allergens: ["egg", "lactose"],
    ingredients: [
      { id: "egg", name: "Eggs", quantity: "180", unit: "units" },
      { id: "spinach", name: "Spinach", quantity: "6", unit: "kg" },
      { id: "feta", name: "Feta", quantity: "3", unit: "kg" },
    ],
  },
  {
    id: "dish-salad",
    name: "Heritage tomato salad",
    description: "Basil vinaigrette",
    badges: ["vegetarian"],
    category: "lunch",
    allergens: [],
    ingredients: [
      { id: "tomato", name: "Tomatoes", quantity: "18", unit: "kg" },
      { id: "basil", name: "Basil", quantity: "500", unit: "g" },
      { id: "vinaigrette", name: "House vinaigrette", quantity: "4", unit: "L" },
    ],
  },
  {
    id: "dish-roast-chicken",
    name: "Lemon-thyme roasted chicken",
    description: "Root vegetables, chicken jus",
    badges: ["glutenFree"],
    category: "lunch",
    allergens: [],
    ingredients: [
      { id: "chicken", name: "Whole chicken", quantity: "60", unit: "kg" },
      { id: "root-veg", name: "Root vegetables", quantity: "25", unit: "kg" },
      { id: "thyme", name: "Fresh thyme", quantity: "500", unit: "g" },
    ],
  },
  {
    id: "dish-paella",
    name: "Seafood paella",
    description: "Saffron rice, mussels, prawns",
    badges: ["spicy"],
    category: "dinner",
    allergens: ["shellfish"],
    ingredients: [
      { id: "rice", name: "Bomba rice", quantity: "22", unit: "kg" },
      { id: "mussels", name: "Mussels", quantity: "18", unit: "kg" },
      { id: "prawns", name: "Prawns", quantity: "12", unit: "kg" },
    ],
  },
];

const BASE_MEALS: MealKey[] = ["breakfast", "lunch", "dinner", "snack"];

function createEmptyDay(id: string, dayKey: PlannerDay["dayKey"]): PlannerDay {
  return {
    id,
    dayKey,
    meals: BASE_MEALS.map((meal) => ({ meal, dishes: [] })),
  };
}

const INITIAL_DAYS: PlannerDay[] = [
  {
    id: "planner-monday",
    dayKey: "monday",
    meals: [
      {
        meal: "breakfast",
        dishes: [MOCK_DISH_LIBRARY[0]],
      },
      {
        meal: "lunch",
        dishes: [MOCK_DISH_LIBRARY[2], MOCK_DISH_LIBRARY[3]],
      },
      {
        meal: "dinner",
        dishes: [],
      },
    ],
  },
  {
    id: "planner-tuesday",
    dayKey: "tuesday",
    meals: [
      {
        meal: "breakfast",
        dishes: [MOCK_DISH_LIBRARY[1]],
      },
      {
        meal: "lunch",
        dishes: [],
      },
      {
        meal: "dinner",
        dishes: [MOCK_DISH_LIBRARY[4]],
      },
    ],
  },
  createEmptyDay("planner-wednesday", "wednesday"),
  createEmptyDay("planner-thursday", "thursday"),
  createEmptyDay("planner-friday", "friday"),
  createEmptyDay("planner-saturday", "saturday"),
  createEmptyDay("planner-sunday", "sunday"),
];

const MOCK_TEMPLATES: PlannerTemplate[] = [
  {
    id: "template-plant-forward",
    name: "Plant-forward rotation",
    description: "High vegetable content with minimal animal proteins.",
  },
  {
    id: "template-classic",
    name: "Classic bistro week",
    description: "Balanced mix of comfort dishes and vegetarian options.",
  },
];

function cloneDish(dish: PlannerDish): PlannerDish {
  return {
    ...dish,
    ingredients: dish.ingredients.map((item) => ({ ...item })),
  };
}

function cloneDay(day: PlannerDay): PlannerDay {
  return {
    ...day,
    meals: day.meals.map((meal) => ({
      ...meal,
      dishes: meal.dishes.map(cloneDish),
    })),
  };
}

export function useMenuPlannerState(): UseMenuPlannerStateResult {
  const [days, setDays] = useState<PlannerDay[]>(INITIAL_DAYS.map(cloneDay));

  const duplicateDay = useCallback((dayId: string) => {
    setDays((current) => {
      const target = current.find((day) => day.id === dayId);
      if (!target) {
        return current;
      }

      const copy = cloneDay(target);
      copy.id = `${target.id}-copy-${Date.now()}`;
      return [...current, copy];
    });
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    console.info("applyTemplate", templateId);
  }, []);

  const exportWeek = useCallback(() => {
    console.info("exportWeek: generating PDF placeholder");
  }, []);

  const moveDishToMeal = useCallback(
    (dayId: string, meal: MealKey, dish: PlannerDish) => {
      setDays((current) =>
        current.map((day) => {
          if (day.id !== dayId) {
            return day;
          }

          return {
            ...day,
            meals: day.meals.map((entry) => {
              if (entry.meal !== meal) {
                return entry;
              }

              const exists = entry.dishes.some((item) => item.id === dish.id);
              if (exists) {
                return entry;
              }

              return {
                ...entry,
                dishes: [...entry.dishes, cloneDish(dish)],
              };
            }),
          };
        })
      );
    },
    []
  );

  const removeDishFromMeal = useCallback((dayId: string, meal: MealKey, dishId: string) => {
    setDays((current) =>
      current.map((day) => {
        if (day.id !== dayId) {
          return day;
        }

        return {
          ...day,
          meals: day.meals.map((entry) => {
            if (entry.meal !== meal) {
              return entry;
            }

            return {
              ...entry,
              dishes: entry.dishes.filter((dish) => dish.id !== dishId),
            };
          }),
        };
      })
    );
  }, []);

  const inventorySummary = useInventorySummary();
  const expiringProducts = useExpiringProducts(3);

  const ingredientSummary = useMemo<IngredientAvailability[]>(() => {
    const aggregation = new Map<string, IngredientAvailability>();

    for (const day of days) {
      for (const meal of day.meals) {
        for (const dish of meal.dishes) {
          for (const ingredient of dish.ingredients) {
            const existing = aggregation.get(ingredient.id);
            const quantity = Number(ingredient.quantity);

            if (!existing) {
              aggregation.set(ingredient.id, {
                id: ingredient.id,
                name: ingredient.name,
                required: Number.isFinite(quantity) ? quantity : 0,
                unit: ingredient.unit,
                missing: 0,
              });
            } else if (Number.isFinite(quantity)) {
              existing.required += quantity;
            }
          }
        }
      }
    }

    const summary = Array.from(aggregation.values());

    summary.forEach((item) => {
      const inventory = inventorySummary.find((stock) => stock.ingredientId === item.id);
      if (inventory) {
        item.inStock = inventory.availableQuantity;
        const delta = inventory.availableQuantity - item.required;
        item.missing = delta >= 0 ? 0 : Math.abs(delta);
      } else {
        item.inStock = 0;
        item.missing = item.required;
      }
    });

    return summary;
  }, [days, inventorySummary]);

  const expiringAlerts = useMemo(() => {
    const alerts = new Map<string, ExpiringIngredientAlert>();

    for (const day of days) {
      for (const meal of day.meals) {
        for (const dish of meal.dishes) {
          for (const ingredient of dish.ingredients) {
            const expiring = expiringProducts.find((entry) => entry.ingredientId === ingredient.id);
            if (!expiring) {
              continue;
            }

            const existing = alerts.get(ingredient.id);
            if (!existing) {
              alerts.set(ingredient.id, {
                ingredientId: ingredient.id,
                daysUntilExpiry: expiring.daysUntilExpiry,
                dishIds: [dish.id],
              });
            } else {
              existing.dishIds.push(dish.id);
              existing.daysUntilExpiry = Math.min(existing.daysUntilExpiry, expiring.daysUntilExpiry);
            }
          }
        }
      }
    }

    return Array.from(alerts.values());
  }, [days, expiringProducts]);

  return {
    days,
    availableTemplates: MOCK_TEMPLATES,
    dishLibrary: MOCK_DISH_LIBRARY,
    duplicateDay,
    applyTemplate,
    exportWeek,
    moveDishToMeal,
    removeDishFromMeal,
    ingredientSummary,
    expiringAlerts,
  };
}

export type { PlannerDish, PlannerDay, PlannerMeal };
