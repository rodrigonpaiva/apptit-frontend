"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyIcon, FileDown, Sparkles, PlusCircle, Trash2, AlertTriangle } from "lucide-react";

import { MealSection, type MealKey } from "@/src/components/menus/MealSection";
import { DishBadge } from "@/src/components/menus/DishBadge";
import { Button } from "@/src/components/ui/button";
import { Select } from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useScopedI18n } from "@/src/lib/useScopedI18n";
import {
  useMenuPlannerState,
  type PlannerDish,
  type PlannerDay,
} from "@/src/lib/useMenuPlannerState";
import { useSuggestDishesFromInventory } from "@/src/lib/useSuggestDishesFromInventory";

const MEAL_ORDER: Record<MealKey, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  snack: 3,
};

const WEEK_ORDER: Record<PlannerDay["dayKey"], number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const MEAL_OPTIONS: MealKey[] = ["breakfast", "lunch", "dinner", "snack"];

export default function MenusPlannerPage() {
  const dict = useScopedI18n("menus");
  const plannerDict = dict.planner;
  const allergensDict = useScopedI18n("allergens");
  const {
    days,
    availableTemplates,
    dishLibrary,
    duplicateDay,
    applyTemplate,
    exportWeek,
    moveDishToMeal,
    removeDishFromMeal,
    ingredientSummary,
    expiringAlerts,
  } = useMenuPlannerState();

  const [selectedDayId, setSelectedDayId] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [targetMeal, setTargetMeal] = useState<MealKey>("lunch");
  const [libraryCategory, setLibraryCategory] = useState<string>("all");
  const [avoidedAllergens, setAvoidedAllergens] = useState<string[]>([]);

  useEffect(() => {
    if (!days.length) {
      setSelectedDayId("");
      return;
    }

    if (!selectedDayId) {
      setSelectedDayId(days[0].id);
      return;
    }

    const exists = days.some((day) => day.id === selectedDayId);
    if (!exists) {
      setSelectedDayId(days[0].id);
    }
  }, [days, selectedDayId]);

  useEffect(() => {
    if (availableTemplates.length && !selectedTemplate) {
      setSelectedTemplate(availableTemplates[0].id);
    }
  }, [availableTemplates, selectedTemplate]);

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    dishLibrary.forEach((dish) => categories.add(dish.category));
    return ["all", ...Array.from(categories)];
  }, [dishLibrary]);

  const allergenOptions = useMemo(() => {
    const allergens = new Set<string>();
    dishLibrary.forEach((dish) => dish.allergens.forEach((code) => allergens.add(code)));
    return Array.from(allergens);
  }, [dishLibrary]);

  const suggestions = useSuggestDishesFromInventory(dishLibrary, {
    category: libraryCategory === "all" ? undefined : libraryCategory,
    allergensToAvoid: avoidedAllergens,
  });

  const sortedDays = useMemo(() => {
    return [...days].sort((a, b) => (WEEK_ORDER[a.dayKey] ?? 99) - (WEEK_ORDER[b.dayKey] ?? 99));
  }, [days]);

  const handleAddDish = (dish: PlannerDish) => {
    if (!selectedDayId || !targetMeal) {
      return;
    }
    moveDishToMeal(selectedDayId, targetMeal, dish);
  };

  const toggleAllergen = (code: string) => {
    setAvoidedAllergens((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code]
    );
  };

  const dayLabels = plannerDict.days as Record<string, string> | undefined;

  const expiringLookup = useMemo(() => {
    const map = new Map<string, number>();
    expiringAlerts.forEach((alert) => {
      alert.dishIds.forEach((dishId) => {
        if (!map.has(dishId)) {
          map.set(dishId, alert.daysUntilExpiry);
        } else {
          map.set(dishId, Math.min(map.get(dishId) ?? alert.daysUntilExpiry, alert.daysUntilExpiry));
        }
      });
    });
    return map;
  }, [expiringAlerts]);

  const renderDish = (dish: PlannerDish, dayId: string, meal: MealKey) => {
    const daysUntilExpiry = expiringLookup.get(dish.id);

    return (
      <div
        key={dish.id}
        className="space-y-2 rounded-xl border border-[var(--border-default)] bg-white p-3 shadow-smx"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{dish.name}</p>
            {dish.description ? (
              <p className="text-xs text-[var(--text-secondary)]">{dish.description}</p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-2 text-xs"
            onClick={() => removeDishFromMeal(dayId, meal, dish.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
        {dish.badges && dish.badges.length ? (
          <div className="flex flex-wrap gap-1">
            {dish.badges.map((badge) => (
              <DishBadge key={`${dish.id}-${badge}`} variant={badge} />
            ))}
          </div>
        ) : null}
        {typeof daysUntilExpiry === "number" ? (
          <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>
              {plannerDict.ingredients?.expiresSoon?.replace("{days}", `${daysUntilExpiry}`)}
            </span>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border-default)] bg-white p-6 shadow-smx">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {plannerDict.heading}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">{plannerDict.description}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                {plannerDict.actions?.dayLabel}
              </label>
              <Select value={selectedDayId} onChange={(event) => setSelectedDayId(event.target.value)}>
                {sortedDays.map((day) => (
                  <option key={day.id} value={day.id}>
                    {dayLabels?.[day.dayKey] ?? day.dayKey}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                {plannerDict.actions?.templateLabel}
              </label>
              <Select
                value={selectedTemplate}
                onChange={(event) => setSelectedTemplate(event.target.value)}
              >
                {availableTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (selectedDayId) {
                duplicateDay(selectedDayId);
              }
            }}
          >
            <CopyIcon className="h-4 w-4" />
            {plannerDict.actions?.duplicate}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (selectedTemplate) {
                applyTemplate(selectedTemplate);
              }
            }}
          >
            <Sparkles className="h-4 w-4" />
            {plannerDict.actions?.applyTemplate}
          </Button>
          <Button type="button" variant="primary" onClick={exportWeek}>
            <FileDown className="h-4 w-4" />
            {plannerDict.actions?.export}
          </Button>
        </div>
        {plannerDict.actions?.exportDescription ? (
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            {plannerDict.actions.exportDescription}
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[2.5fr_minmax(280px,1fr)]">
        <div className="space-y-6">
          <div className="space-y-4">
            {sortedDays.map((day) => (
              <div
                key={day.id}
                className="space-y-4 rounded-3xl border border-[var(--border-default)] bg-white p-4 shadow-smx"
              >
                  <header className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">
                        {dayLabels?.[day.dayKey] ?? day.dayKey}
                      </h3>
                    </div>
                  </header>

                  <div className="grid gap-4 md:grid-cols-3">
                    {day.meals
                      .slice()
                      .sort((a, b) => (MEAL_ORDER[a.meal] ?? 99) - (MEAL_ORDER[b.meal] ?? 99))
                      .map((meal) => (
                        <MealSection
                          key={`${day.id}-${meal.meal}`}
                          meal={meal.meal}
                          droppableId={`${day.id}-${meal.meal}`}
                          totalDishes={meal.dishes.length}
                          footer={meal.note}
                        >
                          {meal.dishes.length ? meal.dishes.map((dish) => renderDish(dish, day.id, meal.meal)) : null}
                        </MealSection>
                      ))}
                  </div>
                </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="space-y-4 rounded-3xl border border-[var(--border-default)] bg-white p-4 shadow-smx">
            <header className="space-y-1">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {plannerDict.dishLibrary?.title}
              </h3>
              {plannerDict.dishLibrary?.description ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  {plannerDict.dishLibrary.description}
                </p>
              ) : null}
            </header>

            <div className="grid gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                  {plannerDict.dishLibrary?.filters?.category}
                </label>
                <Select value={libraryCategory} onChange={(event) => setLibraryCategory(event.target.value)}>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "all" ? dict.filters?.categoryAll ?? "All" : option}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                  {plannerDict.dishLibrary?.filters?.allergens}
                </label>
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map((code) => (
                    <Checkbox
                      key={code}
                      label={allergensDict?.[code as keyof typeof allergensDict] ?? code}
                      checked={avoidedAllergens.includes(code)}
                      onChange={() => toggleAllergen(code)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                  {plannerDict.actions?.dayLabel}
                </label>
                <Select value={targetMeal} onChange={(event) => setTargetMeal(event.target.value as MealKey)}>
                  {MEAL_OPTIONS.map((meal) => (
                    <option key={meal} value={meal}>
                      {dict.meals?.labels?.[meal] ?? meal}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <DishSuggestionList
                title={plannerDict.dishLibrary?.highStock ?? "High stock"}
                addLabel={plannerDict.dishLibrary?.add ?? "Add"}
                dishes={suggestions.highStock}
                onAdd={handleAddDish}
              />
              <DishSuggestionList
                title={plannerDict.dishLibrary?.lowStock ?? "Watch stock"}
                addLabel={plannerDict.dishLibrary?.add ?? "Add"}
                dishes={suggestions.lowStock}
                onAdd={handleAddDish}
              />
              {!suggestions.highStock.length && !suggestions.lowStock.length ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  {plannerDict.dishLibrary?.noMatches}
                </p>
              ) : null}
            </div>
          </section>

          <section className="space-y-3 rounded-3xl border border-[var(--border-default)] bg-white p-4 shadow-smx">
            <header className="space-y-1">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {plannerDict.ingredients?.title}
              </h3>
            </header>
            {ingredientSummary.length ? (
              <ul className="space-y-2">
                {ingredientSummary.map((item) => {
                  const isInsufficient = item.missing > 0;
                  return (
                    <li
                      key={item.id}
                      className={"rounded-xl border px-3 py-2 text-sm".concat(
                        " ",
                        isInsufficient ? "border-red-300 bg-red-50 text-red-700" : "border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-primary)]"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium">{item.name}</span>
                        <div className="text-right text-xs">
                          <div>
                            {plannerDict.ingredients?.quantity}: {item.required} {item.unit ?? ""}
                          </div>
                          <div>
                            {plannerDict.ingredients?.stock}: {item.inStock ?? 0} {item.unit ?? ""}
                          </div>
                          {isInsufficient ? (
                            <div className="font-semibold">
                              {plannerDict.ingredients?.missing}: {item.missing} {item.unit ?? ""}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-[var(--text-secondary)]">
                {plannerDict.ingredients?.empty}
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

type DishSuggestionListProps = {
  title: string;
  addLabel: string;
  dishes: PlannerDish[];
  onAdd: (dish: PlannerDish) => void;
};

function DishSuggestionList({ title, addLabel, dishes, onAdd }: DishSuggestionListProps) {
  if (!dishes.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h4>
      <ul className="space-y-2">
        {dishes.map((dish) => (
          <li key={dish.id} className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{dish.name}</p>
                {dish.description ? (
                  <p className="text-xs text-[var(--text-secondary)]">{dish.description}</p>
                ) : null}
                {dish.badges && dish.badges.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dish.badges.map((badge) => (
                      <DishBadge key={`${dish.id}-${badge}`} variant={badge} />
                    ))}
                  </div>
                ) : null}
              </div>
              <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={() => onAdd(dish)}>
                <PlusCircle className="h-4 w-4" />
                {" "}
                {addLabel}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
