import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { vi, type MockedFunction } from "vitest";

import MenusPlannerPage from "./page";
import {
  useMenuPlannerState,
  type IngredientAvailability,
  type PlannerDish,
} from "@/src/lib/useMenuPlannerState";

vi.mock("@/src/lib/useMenuPlannerState");
vi.mock("@/src/lib/useSuggestDishesFromInventory", () => ({
  useSuggestDishesFromInventory: vi.fn().mockReturnValue({ highStock: [], lowStock: [] }),
}));

const mockUseMenuPlannerState = useMenuPlannerState as MockedFunction<typeof useMenuPlannerState>;

function buildDish(overrides: Partial<PlannerDish> = {}): PlannerDish {
  return {
    id: "dish-test",
    name: "Test Dish",
    description: "Description",
    badges: [],
    category: "lunch",
    allergens: [],
    ingredients: [],
    ...overrides,
  };
}

describe("MenusPlannerPage", () => {
  beforeEach(() => {
    mockUseMenuPlannerState.mockReturnValue({
      days: [
        {
          id: "planner-monday",
          dayKey: "monday",
          meals: [
            { meal: "breakfast", dishes: [], note: undefined },
            {
              meal: "lunch",
              dishes: [
                buildDish({
                  id: "dish-expiring",
                  name: "Salade",
                  ingredients: [
                    { id: "tomato", name: "Tomatoes", quantity: "10", unit: "kg" },
                  ],
                }),
              ],
              note: undefined,
            },
            { meal: "dinner", dishes: [], note: undefined },
            { meal: "snack", dishes: [], note: undefined },
          ],
        },
      ],
      availableTemplates: [],
      dishLibrary: [],
      duplicateDay: vi.fn(),
      applyTemplate: vi.fn(),
      exportWeek: vi.fn(),
      moveDishToMeal: vi.fn(),
      removeDishFromMeal: vi.fn(),
      ingredientSummary: [
        {
          id: "tomato",
          name: "Tomatoes",
          required: 20,
          unit: "kg",
          inStock: 8,
          missing: 12,
        } satisfies IngredientAvailability,
      ],
      expiringAlerts: [
        {
          ingredientId: "tomato",
          daysUntilExpiry: 2,
          dishIds: ["dish-expiring"],
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("highlights missing ingredients in the summary", async () => {
    render(<MenusPlannerPage />);

    const ingredientRow = await screen.findByText("Tomatoes");
    const rowContainer = ingredientRow.closest("li");

    expect(rowContainer).toHaveClass("bg-red-50");
    expect(rowContainer).toHaveTextContent(/Missing: 12 kg/i);
  });

  it("shows expiry alert on dishes using soon-to-expire ingredients", async () => {
    render(<MenusPlannerPage />);

    expect(await screen.findByText(/Expires in 2 days/i)).toBeInTheDocument();
  });
});
