"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { MenuDayCard } from "@/src/components/menus/MenuDayCard";
import type { MealKey } from "@/src/components/menus/MealSection";
import type { DishBadgeVariant } from "@/src/components/menus/DishBadge";
import { NutriEcoStrip } from "@/src/components/menus/NutriEcoStrip";
import { FilterBar } from "@/src/components/ui/FilterBar";
import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/ui/empty-state";
import { ErrorState } from "@/src/components/ui/error-state";
import { useWeeklyMenu, type WeeklyMenuData } from "@/src/lib/useWeeklyMenu";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return DATE_FORMATTER.format(date);
}

function mapToCardMeals(
  dayId: string,
  meals: WeeklyMenuData["menus"][number]["meals"]
) {
  return meals.map((meal) => ({
    meal: meal.meal as MealKey,
    note: meal.note,
    droppableId: `${dayId}-${meal.meal}`,
    dishes: meal.dishes.map((dish) => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      badges: dish.badges as DishBadgeVariant[] | undefined,
      extra: dish.extra,
    })),
  }));
}

export default function MenusWeekPage() {
  const menusDict = useScopedI18n("menus");
  const allergensDict = useScopedI18n("allergens");
  const { data, loading, error, refetch } = useWeeklyMenu();

  const [category, setCategory] = useState<string>("all");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);

  useEffect(() => {
    if (!data) {
      return;
    }
    setCategory(data.filters.defaultCategory || "all");
    setSelectedAllergens(data.filters.defaultAllergens || []);
  }, [data]);

  const categoryOptions = useMemo(() => {
    if (!data) {
      return [];
    }

    const optionLabels = menusDict.filters?.options as Record<string, string> | undefined;

    return data.filters.categories.map((option) => ({
      value: option.id,
      label: optionLabels?.[option.id] ?? option.label ?? option.id,
    }));
  }, [data, menusDict.filters]);

  const allergenOptions = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filters.allergens.map((option) => ({
      value: option.id,
      label: allergensDict?.[option.id as keyof typeof allergensDict] ?? option.label ?? option.id,
    }));
  }, [allergensDict, data]);

  const filteredMenus = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.menus.map((day) => ({
      ...day,
      meals: day.meals.map((meal) => {
        const dishes = meal.dishes.filter((dish) => {
          const matchesCategory = category === "all" || dish.category === category;
          const excludesSelectedAllergens =
            selectedAllergens.length === 0 ||
            selectedAllergens.every((code) => !dish.allergens.includes(code));

          return matchesCategory && excludesSelectedAllergens;
        });

        return {
          ...meal,
          dishes,
        };
      }),
    }));
  }, [category, data, selectedAllergens]);

  const dayLabels = menusDict.week?.days as Record<string, string> | undefined;
  const weekOrder: Record<string, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };
  const planCta =
    menusDict.header?.primaryCta ?? menusDict.week?.planCta ?? "Start planning";
  const summaryTitle = menusDict.week?.summaryTitle ?? "Weekly nutrition";

  const totalVisibleDishes = useMemo(() => {
    return filteredMenus.reduce((dayAcc, day) => {
      return (
        dayAcc +
        day.meals.reduce((mealAcc, meal) => {
          return mealAcc + meal.dishes.length;
        }, 0)
      );
    }, 0);
  }, [filteredMenus]);

  const handleResetFilters = () => {
    if (!data) {
      return;
    }
    setCategory(data.filters.defaultCategory || "all");
    setSelectedAllergens(data.filters.defaultAllergens || []);
  };

  const showEmptyState = !loading && !error && (!data || data.menus.length === 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {menusDict.week?.heading}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {menusDict.week?.description}
          </p>
        </div>
        <Link
          href="/menus/planner"
          className="btn btn-primary"
          aria-label={planCta}
        >
          {planCta}
        </Link>
      </div>

      {data ? (
        <FilterBar
          categoryValue={category}
          categoryOptions={categoryOptions}
          allergenValues={selectedAllergens}
          allergenOptions={allergenOptions}
          onCategoryChange={setCategory}
          onAllergensChange={setSelectedAllergens}
          onReset={handleResetFilters}
        />
      ) : null}

      {loading ? (
        <EmptyState
          icon={<Loader2 className="h-6 w-6 animate-spin text-[var(--text-secondary)]" />}
          title={menusDict.week?.loading ?? "Loading weekly menus"}
          description={menusDict.week?.loadingDescription}
        />
      ) : error ? (
        <ErrorState
          title={menusDict.week?.error?.title ?? "Unable to load menus"}
          description={menusDict.week?.error?.description ?? error}
          action={
            <Button type="button" variant="primary" onClick={refetch}>
              {menusDict.week?.error?.retry ?? "Retry"}
            </Button>
          }
        />
      ) : showEmptyState ? (
        <EmptyState
          title={menusDict.week?.empty?.title ?? "Weekly planning coming soon"}
          description={menusDict.week?.empty?.description}
          action={
            <Link href="/menus/planner" className="btn btn-secondary">
              {menusDict.week?.empty?.action ?? planCta}
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {data?.summary ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{summaryTitle}</h3>
              <NutriEcoStrip {...data.summary} />
            </div>
          ) : null}

          <div className="space-y-6">
            {[...filteredMenus]
              .sort((a, b) => (weekOrder[a.dayKey] ?? 99) - (weekOrder[b.dayKey] ?? 99))
              .map((day) => (
                <MenuDayCard
                  key={day.id}
                  title={dayLabels?.[day.dayKey] ?? day.dayKey}
                  dateLabel={formatDateLabel(day.date)}
                  headcount={day.headcount}
                  meals={mapToCardMeals(day.id, day.meals)}
                  nutrition={day.nutrition}
                />
              ))}
          </div>

          {totalVisibleDishes === 0 ? (
            <EmptyState
              title={menusDict.week?.noResults?.title ?? "No dishes match your filters"}
              description={menusDict.week?.noResults?.description}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
