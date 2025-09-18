"use client";

import { type ReactNode } from "react";
import { CalendarDays, Users } from "lucide-react";

import { MealSection, type MealKey } from "@/src/components/menus/MealSection";
import { DishBadge, type DishBadgeVariant } from "@/src/components/menus/DishBadge";
import { NutriEcoStrip, type NutriEcoStripProps } from "@/src/components/menus/NutriEcoStrip";
import { cn } from "@/src/lib/cn";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

type Dish = {
  id: string;
  name: string;
  description?: string;
  badges?: DishBadgeVariant[];
  extra?: ReactNode;
};

const PRIMARY_MEALS: MealKey[] = ["breakfast", "lunch", "dinner"];

const MEAL_ORDER: Record<MealKey, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  snack: 3,
};

type MealBlock = {
  meal: MealKey;
  dishes: Dish[];
  droppableId?: string;
  note?: string;
};

export type MenuDayCardProps = {
  title: string;
  dateLabel?: string;
  headcount?: number;
  meals: MealBlock[];
  nutrition?: NutriEcoStripProps;
  className?: string;
  onAddDish?: (meal: MealKey) => void;
};

export function MenuDayCard({
  title,
  dateLabel,
  headcount,
  meals,
  nutrition,
  className,
  onAddDish,
}: MenuDayCardProps) {
  const dict = useScopedI18n("menus");
  const dayLabels = dict.dayCard ?? {};

  const renderDishItems = (mealBlock: MealBlock) => {
    return mealBlock.dishes.map((dish) => (
      <div
        key={dish.id}
        role="listitem"
        className="rounded-xl border border-[var(--border-default)] bg-white p-3 shadow-smx"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{dish.name}</p>
            {dish.description ? (
              <p className="text-xs text-[var(--text-secondary)]">{dish.description}</p>
            ) : null}
          </div>
          {dish.badges && dish.badges.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1">
              {dish.badges.map((badge) => (
                <DishBadge key={`${dish.id}-${badge}`} variant={badge} />
              ))}
            </div>
          ) : null}
        </div>
        {dish.extra ? (
          <div className="mt-2 text-xs text-[var(--text-secondary)]">{dish.extra}</div>
        ) : null}
      </div>
    ));
  };

  return (
    <article
      className={cn(
        "space-y-6 rounded-3xl border border-[var(--border-default)] bg-white p-6 shadow-smx",
        className
      )}
      aria-labelledby={`menu-day-${title}`}
    >
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 id={`menu-day-${title}`} className="text-xl font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          {dateLabel ? (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <span>{dateLabel}</span>
            </div>
          ) : null}
        </div>

        {typeof headcount === "number" ? (
          <div className="flex items-center gap-2 rounded-full bg-[var(--surface-raised)] px-3 py-1 text-sm text-[var(--text-secondary)]">
            <Users className="h-4 w-4" aria-hidden />
            <span>
              {headcount} {dayLabels.guests ?? "guests"}
            </span>
          </div>
        ) : null}
      </header>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {PRIMARY_MEALS.map((mealKey) => {
            const mealBlock = meals.find((block) => block.meal === mealKey) ?? {
              meal: mealKey,
              dishes: [],
            };
            const hasDishes = mealBlock.dishes.length > 0;
            return (
              <MealSection
                key={mealBlock.meal}
                meal={mealBlock.meal}
                droppableId={mealBlock.droppableId}
                totalDishes={mealBlock.dishes.length}
                onAddDish={onAddDish ? () => onAddDish(mealBlock.meal) : undefined}
                footer={mealBlock.note}
              >
                {hasDishes ? renderDishItems(mealBlock) : null}
              </MealSection>
            );
          })}
        </div>

        {meals.filter((meal) => !PRIMARY_MEALS.includes(meal.meal)).length > 0 ? (
          <div className="space-y-4">
            {[...meals]
              .filter((meal) => !PRIMARY_MEALS.includes(meal.meal))
              .sort((a, b) => (MEAL_ORDER[a.meal] ?? 99) - (MEAL_ORDER[b.meal] ?? 99))
              .map((mealBlock) => {
                const hasDishes = mealBlock.dishes.length > 0;
                return (
                  <MealSection
                    key={mealBlock.meal}
                    meal={mealBlock.meal}
                    droppableId={mealBlock.droppableId}
                    totalDishes={mealBlock.dishes.length}
                    onAddDish={onAddDish ? () => onAddDish(mealBlock.meal) : undefined}
                    footer={mealBlock.note}
                  >
                    {hasDishes ? renderDishItems(mealBlock) : null}
                  </MealSection>
                );
              })}
          </div>
        ) : null}
      </div>

      {nutrition ? <NutriEcoStrip {...nutrition} /> : null}
    </article>
  );
}
