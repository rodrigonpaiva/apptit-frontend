"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type WeeklyMenuDietaryTag =
  | "vegan"
  | "vegetarian"
  | "glutenFree"
  | "spicy"
  | "nut"
  | "lactoseFree";

export type WeeklyMenuMealKey = "breakfast" | "lunch" | "dinner" | "snack";

export type WeeklyMenuDish = {
  id: string;
  name: string;
  description?: string;
  badges?: WeeklyMenuDietaryTag[];
  category: string;
  allergens: string[];
  extra?: string;
};

export type WeeklyMenuMeal = {
  meal: WeeklyMenuMealKey;
  note?: string;
  dishes: WeeklyMenuDish[];
};

export type WeeklyMenuDay = {
  id: string;
  dayKey: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  date: string; // ISO date string
  headcount: number;
  meals: WeeklyMenuMeal[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    ecoScore?: string;
    servingsLabel?: string;
  };
  notes?: string;
};

export type WeeklyMenuFilters = {
  categories: Array<{ id: string; label?: string }>;
  allergens: Array<{ id: string; label?: string }>;
  defaultCategory: string;
  defaultAllergens: string[];
};

export type WeeklyMenuData = {
  summary?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    ecoScore?: string;
    servingsLabel?: string;
  };
  menus: WeeklyMenuDay[];
  filters: WeeklyMenuFilters;
};

export type UseWeeklyMenuResult = {
  data?: WeeklyMenuData;
  loading: boolean;
  error?: string;
  refetch: () => void;
};

const MOCK_WEEKLY_MENU: WeeklyMenuData = {
  summary: {
    calories: 11280,
    protein: 428,
    carbohydrates: 982,
    fat: 368,
    ecoScore: "B+",
    servingsLabel: "per service",
  },
  filters: {
    categories: [
      { id: "seasonal" },
      { id: "plantBased" },
      { id: "comfort" },
      { id: "kids" },
    ],
    allergens: [
      { id: "gluten" },
      { id: "lactose" },
      { id: "nuts" },
      { id: "soy" },
      { id: "egg" },
    ],
    defaultCategory: "all",
    defaultAllergens: [],
  },
  menus: [
    {
      id: "monday",
      dayKey: "monday",
      date: "2024-06-03",
      headcount: 118,
      meals: [
        {
          meal: "breakfast",
          note: "Prep window opens at 06:00",
          dishes: [
            {
              id: "mon-breakfast-porridge",
              name: "Steel-cut oat porridge",
              description: "Citrus compote, toasted seeds",
              badges: ["vegetarian", "lactoseFree"],
              category: "seasonal",
              allergens: ["nuts"],
              extra: "Batch cook 14 L",
            },
            {
              id: "mon-breakfast-frittata",
              name: "Spinach & feta frittata",
              description: "Free-range eggs, roasted peppers",
              badges: ["vegetarian"],
              category: "comfort",
              allergens: ["egg", "lactose"],
            },
          ],
        },
        {
          meal: "lunch",
          note: "Delivery pallet arrives 09:30",
          dishes: [
            {
              id: "mon-lunch-salad",
              name: "Heritage tomato & mozzarella salad",
              description: "Basil vinaigrette, saba glaze",
              badges: ["vegetarian"],
              category: "seasonal",
              allergens: ["lactose"],
            },
            {
              id: "mon-lunch-main",
              name: "Lemon-thyme roasted chicken",
              description: "Root vegetables, chicken jus",
              badges: ["glutenFree"],
              category: "comfort",
              allergens: [],
              extra: "Portion at 180 g cooked weight",
            },
            {
              id: "mon-lunch-dessert",
              name: "Spiced pear crumble",
              description: "Vanilla bean custard",
              badges: ["nut"],
              category: "comfort",
              allergens: ["gluten", "lactose", "nuts"],
            },
          ],
        },
        {
          meal: "dinner",
          note: "Switch hot line to evening mise en place at 15:00",
          dishes: [
            {
              id: "mon-dinner-soup",
              name: "Roasted cauliflower velouté",
              description: "Chive oil, smoked paprika",
              badges: ["vegan", "glutenFree"],
              category: "plantBased",
              allergens: [],
            },
            {
              id: "mon-dinner-main",
              name: "Seared cod with fennel",
              description: "Citrus beurre blanc",
              badges: [],
              category: "seasonal",
              allergens: ["fish", "lactose"],
              extra: "Sous-vide portions 140 g",
            },
          ],
        },
      ],
      nutrition: {
        calories: 1680,
        protein: 98,
        carbohydrates: 210,
        fat: 54,
        ecoScore: "B",
        servingsLabel: "average per guest",
      },
    },
    {
      id: "tuesday",
      dayKey: "tuesday",
      date: "2024-06-04",
      headcount: 124,
      meals: [
        {
          meal: "breakfast",
          dishes: [
            {
              id: "tue-breakfast-granola",
              name: "Buckwheat granola parfait",
              description: "Coconut yogurt, mango coulis",
              badges: ["vegan", "glutenFree"],
              category: "plantBased",
              allergens: ["nuts"],
            },
            {
              id: "tue-breakfast-toast",
              name: "Sourdough tartine",
              description: "Whipped ricotta, roasted grapes",
              badges: ["vegetarian"],
              category: "seasonal",
              allergens: ["gluten", "lactose"],
            },
          ],
        },
        {
          meal: "lunch",
          dishes: [
            {
              id: "tue-lunch-soup",
              name: "Spring pea soup",
              description: "Mint oil, toasted sunflower seeds",
              badges: ["vegan"],
              category: "plantBased",
              allergens: [],
            },
            {
              id: "tue-lunch-main",
              name: "Beef tagine",
              description: "Apricots, preserved lemon, almonds",
              badges: ["spicy", "nut"],
              category: "comfort",
              allergens: ["nuts"],
              extra: "Serve with herbed couscous",
            },
            {
              id: "tue-lunch-veg",
              name: "Charred cauliflower shawarma",
              description: "Tahini drizzle, pickled onions",
              badges: ["vegan"],
              category: "plantBased",
              allergens: ["sesame"],
            },
          ],
        },
        {
          meal: "dinner",
          dishes: [
            {
              id: "tue-dinner-stew",
              name: "Braised lentil & mushroom stew",
              description: "Celeriac mash",
              badges: ["vegan"],
              category: "plantBased",
              allergens: [],
            },
            {
              id: "tue-dinner-salad",
              name: "Citrus & endive salad",
              description: "Candied pecans, orange vinaigrette",
              badges: ["vegetarian", "nut"],
              category: "seasonal",
              allergens: ["nuts"],
            },
          ],
        },
      ],
      nutrition: {
        calories: 1610,
        protein: 92,
        carbohydrates: 198,
        fat: 48,
        ecoScore: "A-",
        servingsLabel: "average per guest",
      },
    },
    {
      id: "wednesday",
      dayKey: "wednesday",
      date: "2024-06-05",
      headcount: 110,
      meals: [
        {
          meal: "breakfast",
          dishes: [
            {
              id: "wed-breakfast-chia",
              name: "Chia pudding",
              description: "Passion fruit, toasted coconut",
              badges: ["vegan", "glutenFree"],
              category: "plantBased",
              allergens: [],
            },
            {
              id: "wed-breakfast-sandwich",
              name: "Smoked salmon brioche",
              description: "Cream cheese, dill",
              badges: [],
              category: "comfort",
              allergens: ["gluten", "fish", "lactose"],
            },
          ],
        },
        {
          meal: "lunch",
          note: "Confirm veg delivery before 08:00",
          dishes: [
            {
              id: "wed-lunch-main",
              name: "Herb-crusted pork loin",
              description: "Roasted apple chutney",
              badges: [],
              category: "comfort",
              allergens: ["gluten"],
            },
            {
              id: "wed-lunch-veg",
              name: "Farro & roasted vegetable salad",
              description: "Parsley pesto",
              badges: ["vegetarian"],
              category: "seasonal",
              allergens: ["gluten", "nuts"],
            },
            {
              id: "wed-lunch-dessert",
              name: "Chocolate orange pot de crème",
              description: "Candied zest",
              badges: ["vegetarian"],
              category: "comfort",
              allergens: ["egg", "lactose"],
            },
          ],
        },
        {
          meal: "dinner",
          dishes: [
            {
              id: "wed-dinner-pasta",
              name: "Wild mushroom pappardelle",
              description: "Truffle butter, parmesan",
              badges: ["vegetarian"],
              category: "comfort",
              allergens: ["gluten", "lactose"],
            },
            {
              id: "wed-dinner-side",
              name: "Crisp kale & fennel salad",
              description: "Citrus vinaigrette",
              badges: ["vegan"],
              category: "plantBased",
              allergens: [],
            },
          ],
        },
      ],
      nutrition: {
        calories: 1740,
        protein: 101,
        carbohydrates: 222,
        fat: 62,
        ecoScore: "B-",
        servingsLabel: "average per guest",
      },
    },
    {
      id: "thursday",
      dayKey: "thursday",
      date: "2024-06-06",
      headcount: 116,
      meals: [
        {
          meal: "breakfast",
          dishes: [
            {
              id: "thu-breakfast-waffle",
              name: "Buckwheat waffle",
              description: "Berry compote, maple syrup",
              badges: ["vegetarian"],
              category: "kids",
              allergens: ["gluten", "lactose", "egg"],
            },
            {
              id: "thu-breakfast-bowl",
              name: "Green smoothie bowl",
              description: "Kale, pineapple, hemp seeds",
              badges: ["vegan", "glutenFree"],
              category: "plantBased",
              allergens: ["nuts"],
            },
          ],
        },
        {
          meal: "lunch",
          dishes: [
            {
              id: "thu-lunch-main",
              name: "Sumac roasted turkey",
              description: "Grain pilaf, roasted carrots",
              badges: ["glutenFree"],
              category: "seasonal",
              allergens: ["nuts"],
            },
            {
              id: "thu-lunch-veg",
              name: "Harissa roasted cauliflower",
              description: "Golden raisins, pistachio crumble",
              badges: ["vegan", "spicy"],
              category: "plantBased",
              allergens: ["nuts"],
            },
            {
              id: "thu-lunch-dessert",
              name: "Citrus olive oil cake",
              description: "Mascarpone chantilly",
              badges: ["vegetarian"],
              category: "comfort",
              allergens: ["gluten", "lactose", "egg"],
            },
          ],
        },
        {
          meal: "dinner",
          dishes: [
            {
              id: "thu-dinner-curry",
              name: "Coconut red curry",
              description: "Butternut squash, Thai basil",
              badges: ["vegan", "spicy"],
              category: "plantBased",
              allergens: ["soy"],
            },
            {
              id: "thu-dinner-rice",
              name: "Jasmine rice",
              description: "Toasted coconut",
              badges: ["vegan", "glutenFree"],
              category: "plantBased",
              allergens: [],
            },
          ],
        },
      ],
      nutrition: {
        calories: 1625,
        protein: 95,
        carbohydrates: 204,
        fat: 52,
        ecoScore: "A",
        servingsLabel: "average per guest",
      },
    },
    {
      id: "friday",
      dayKey: "friday",
      date: "2024-06-07",
      headcount: 132,
      meals: [
        {
          meal: "breakfast",
          dishes: [
            {
              id: "fri-breakfast-bread",
              name: "Seeded breakfast bread",
              description: "Whipped butter, local honey",
              badges: ["vegetarian"],
              category: "comfort",
              allergens: ["gluten", "lactose"],
            },
            {
              id: "fri-breakfast-bento",
              name: "Fruit & yogurt bento",
              description: "Granola clusters, mint",
              badges: ["vegetarian"],
              category: "kids",
              allergens: ["lactose", "nuts"],
            },
          ],
        },
        {
          meal: "lunch",
          note: "Guest VIP table at 12:45",
          dishes: [
            {
              id: "fri-lunch-main",
              name: "Grilled hake",
              description: "Salsa verde, crushed potatoes",
              badges: ["glutenFree"],
              category: "seasonal",
              allergens: ["fish"],
            },
            {
              id: "fri-lunch-veg",
              name: "Savoy cabbage galette",
              description: "Black garlic cream",
              badges: ["vegetarian"],
              category: "comfort",
              allergens: ["gluten", "lactose"],
            },
            {
              id: "fri-lunch-dessert",
              name: "Rhubarb & strawberry compote",
              description: "Oat crumble",
              badges: ["vegan"],
              category: "seasonal",
              allergens: ["gluten", "nuts"],
            },
          ],
        },
        {
          meal: "dinner",
          dishes: [
            {
              id: "fri-dinner-burger",
              name: "Smoked beet burger",
              description: "Pickled onions, vegan aioli",
              badges: ["vegan", "spicy"],
              category: "plantBased",
              allergens: ["gluten", "soy"],
            },
            {
              id: "fri-dinner-fries",
              name: "Crispy polenta fries",
              description: "Rosemary salt",
              badges: ["vegan", "glutenFree"],
              category: "comfort",
              allergens: [],
            },
          ],
        },
      ],
      nutrition: {
        calories: 1675,
        protein: 93,
        carbohydrates: 216,
        fat: 58,
        ecoScore: "B",
        servingsLabel: "average per guest",
      },
    },
    {
      id: "saturday",
      dayKey: "saturday",
      date: "2024-06-08",
      headcount: 140,
      meals: [
        {
          meal: "breakfast",
          dishes: [
            {
              id: "sat-breakfast-skillet",
              name: "Sweet potato skillet",
              description: "Poached egg, charred scallions",
              badges: ["glutenFree"],
              category: "comfort",
              allergens: ["egg"],
            },
            {
              id: "sat-breakfast-smoothie",
              name: "Tropical smoothie bowl",
              description: "Mango, passion fruit, coconut crunch",
              badges: ["vegan", "glutenFree"],
              category: "plantBased",
              allergens: ["nuts"],
            },
          ],
        },
        {
          meal: "lunch",
          dishes: [
            {
              id: "sat-lunch-bowl",
              name: "Quinoa harvest bowl",
              description: "Roasted squash, tahini drizzle",
              badges: ["vegan", "glutenFree"],
              category: "plantBased",
              allergens: ["nuts"],
            },
            {
              id: "sat-lunch-main",
              name: "Slow-smoked brisket",
              description: "BBQ glaze, pickled slaw",
              badges: ["spicy"],
              category: "comfort",
              allergens: ["soy"],
            },
          ],
        },
        {
          meal: "dinner",
          dishes: [
            {
              id: "sat-dinner-paella",
              name: "Seafood paella",
              description: "Saffron rice, mussels, prawns",
              badges: ["spicy"],
              category: "seasonal",
              allergens: ["shellfish"],
            },
            {
              id: "sat-dinner-salad",
              name: "Heirloom tomato salad",
              description: "Burrata, basil oil",
              badges: ["vegetarian"],
              category: "seasonal",
              allergens: ["lactose"],
            },
          ],
        },
      ],
      nutrition: {
        calories: 1720,
        protein: 105,
        carbohydrates: 230,
        fat: 64,
        ecoScore: "B",
        servingsLabel: "average per guest",
      },
    },
    {
      id: "sunday",
      dayKey: "sunday",
      date: "2024-06-09",
      headcount: 102,
      meals: [
        {
          meal: "breakfast",
          dishes: [
            {
              id: "sun-breakfast-crepes",
              name: "Buckwheat crêpes",
              description: "Seasonal compote, vanilla yogurt",
              badges: ["vegetarian"],
              category: "comfort",
              allergens: ["gluten", "lactose", "egg"],
            },
            {
              id: "sun-breakfast-bowl",
              name: "Tropical fruit bowl",
              description: "Mint, toasted coconut",
              badges: ["vegan", "glutenFree"],
              category: "plantBased",
              allergens: [],
            },
          ],
        },
        {
          meal: "lunch",
          dishes: [
            {
              id: "sun-lunch-roast",
              name: "Herb roasted lamb",
              description: "Rosemary jus, root vegetables",
              badges: [],
              category: "comfort",
              allergens: [],
            },
            {
              id: "sun-lunch-veg",
              name: "Grilled asparagus tart",
              description: "Goat cheese, lemon",
              badges: ["vegetarian"],
              category: "seasonal",
              allergens: ["gluten", "lactose", "egg"],
            },
          ],
        },
        {
          meal: "dinner",
          dishes: [
            {
              id: "sun-dinner-soup",
              name: "Miso ramen",
              description: "Tofu, shiitake, bok choy",
              badges: ["vegan", "spicy"],
              category: "plantBased",
              allergens: ["soy", "gluten"],
            },
            {
              id: "sun-dinner-dessert",
              name: "Almond financier",
              description: "Poached apricots",
              badges: ["nut"],
              category: "comfort",
              allergens: ["gluten", "nuts", "egg"],
            },
          ],
        },
      ],
      nutrition: {
        calories: 1580,
        protein: 88,
        carbohydrates: 196,
        fat: 50,
        ecoScore: "B+",
        servingsLabel: "average per guest",
      },
    },
  ],
};

export function useWeeklyMenu(): UseWeeklyMenuResult {
  const [data, setData] = useState<WeeklyMenuData | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setError(undefined);

    timeoutRef.current = setTimeout(() => {
      setData(MOCK_WEEKLY_MENU);
      setLoading(false);
      timeoutRef.current = null;
    }, 400);
  }, []);

  useEffect(() => {
    loadData();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loadData]);

  const refetch = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
