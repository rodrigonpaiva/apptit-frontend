"use client";

import { type ChangeEvent } from "react";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Select } from "@/src/components/ui/select";
import { cn } from "@/src/lib/cn";
import { useScopedI18n } from "@/src/lib/useScopedI18n";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterBarProps = {
  categoryValue: string;
  categoryOptions: FilterOption[];
  allergenValues: string[];
  allergenOptions: FilterOption[];
  onCategoryChange: (value: string) => void;
  onAllergensChange: (values: string[]) => void;
  onReset?: () => void;
  onApply?: () => void;
  isApplyDisabled?: boolean;
  className?: string;
};

export function FilterBar({
  categoryValue,
  categoryOptions,
  allergenValues,
  allergenOptions,
  onCategoryChange,
  onAllergensChange,
  onReset,
  onApply,
  isApplyDisabled,
  className,
}: FilterBarProps) {
  const dict = useScopedI18n("menus");
  const filters = dict.filters ?? {};

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(event.target.value);
  };

  const handleAllergenToggle = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const isActive = allergenValues.includes(value);

    if (isChecked && !isActive) {
      onAllergensChange([...allergenValues, value]);
    } else if (!isChecked && isActive) {
      onAllergensChange(allergenValues.filter((item) => item !== value));
    }
  };

  return (
    <section
      aria-label={filters.title ?? "Filters"}
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-[var(--border-default)] bg-white p-4 shadow-smx md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-end">
        <Select
          label={filters.categoryLabel ?? "Category"}
          value={categoryValue}
          onChange={handleCategoryChange}
          className="md:min-w-[200px]"
        >
          <option value="all">{filters.categoryAll ?? "All categories"}</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-[var(--text-primary)]">
            {filters.allergensLabel ?? "Allergens"}
          </legend>
          <p className="text-xs text-[var(--text-secondary)]">
            {filters.allergensHint ?? "Toggle allergens to include or exclude."}
          </p>
          <div className="flex flex-wrap gap-2">
            {allergenOptions.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                checked={allergenValues.includes(option.value)}
                onChange={handleAllergenToggle(option.value)}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex items-center gap-2">
        {onReset ? (
          <Button type="button" variant="ghost" onClick={onReset}>
            {filters.reset ?? "Reset"}
          </Button>
        ) : null}
        {onApply ? (
          <Button type="button" variant="primary" onClick={onApply} disabled={isApplyDisabled}>
            {filters.apply ?? "Apply"}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
