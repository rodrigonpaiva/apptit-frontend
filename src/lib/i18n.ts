import enLocales from "./locales/en.json";
import frLocales from "./locales/fr.json";

const dictionaries = {
  en: {
    common: {
      searchLabel: "Search",
      clear: "Clear",
      reset: "Reset",
      apply: "Apply",
      previous: "Previous",
      next: "Next",
      of: "of",
      retry: "Retry",
      saving: "Saving...",
    },
    inventory: {
      pageTitle: "Inventory",
      pageSubtitle: "Monitor stock levels, allergens, and expiration dates.",
      filtersTitle: "Filters",
      searchPlaceholder: "Search by product or SKU",
      categoryLabel: "Category",
      categoryAll: "All categories",
      allergenLabel: "Allergens",
      allergenAll: "Any allergen",
      expirationLabel: "Expiration",
      expirationAll: "All expiration dates",
      expirationSoon: "Expiring soon",
      expirationSoonHelp: "Show items expiring within 7 days",
      resetFilters: "Reset filters",
      resultsCaption: "Inventory results",
      emptyStateTitle: "No products match your filters",
      emptyStateDescription: "Adjust the filters or add a new product to your inventory.",
      paginationLabel: "Inventory pagination",
      summaryTitle: "Inventory status",
      summaryExpiringSoon: "Expiring soon",
      summaryLowStock: "Low stock",
      summaryInStock: "In stock",
      paginationPage: "Page",
      expirationAll: "All products",
      expiration7: "≤ 7 days",
      expiration14: "≤ 14 days",
      expiration30: "≤ 30 days",
      expirationSegmentLabel: "Expires in",
      errorTitle: "Unable to load inventory",
      errorDescription: "Please try again or contact support if the issue persists.",
    },
    productCard: {
      stockLabel: "Stock",
      unitLabel: "units",
      priceLabel: "Price",
      statusOk: "OK",
      statusWarning: "Check",
      ariaPrefix: "Product",
      moreActions: "More actions",
    },
    productDetails: {
      title: "Product details",
      barcodeLabel: "Barcode",
      skuLabel: "SKU",
      categoryLabel: "Category",
      stockLabel: "Current stock",
      allergensLabel: "Allergens",
      allergensNone: "No allergens declared",
      ecoScoreLabel: "Eco-score",
      supplierLabel: "Supplier",
      locationLabel: "Storage location",
      reorderPointLabel: "Reorder point",
      updatedAtLabel: "Last updated",
      close: "Close",
    },
    haccp: enLocales.haccp,
    menus: enLocales.menus,
    allergens: {
      gluten: "Gluten",
      lactose: "Lactose",
      nuts: "Tree nuts",
      shellfish: "Shellfish",
      soy: "Soy",
      egg: "Egg",
      fish: "Fish",
      vegan: "Plant-based",
      poison: "High risk",
    },
    categories: {
      produce: "Fresh produce",
      dairy: "Dairy",
      protein: "Proteins",
      dry: "Dry goods",
      beverage: "Beverages",
      condiments: "Condiments",
      bakery: "Bakery",
      prepared: "Prepared meals",
    },
  },
  fr: {
    common: {
      searchLabel: "Search",
      clear: "Clear",
      reset: "Reset",
      apply: "Apply",
      previous: "Previous",
      next: "Next",
      of: "of",
      retry: "Retry",
      saving: "Enregistrement...",
    },
    inventory: {
      pageTitle: "Inventory",
      pageSubtitle: "Monitor stock levels, allergens, and expiration dates.",
      filtersTitle: "Filters",
      searchPlaceholder: "Search by product or SKU",
      categoryLabel: "Category",
      categoryAll: "All categories",
      allergenLabel: "Allergens",
      allergenAll: "Any allergen",
      expirationLabel: "Expiration",
      expirationAll: "All expiration dates",
      expirationSoon: "Expiring soon",
      expirationSoonHelp: "Show items expiring within 7 days",
      resetFilters: "Reset filters",
      resultsCaption: "Inventory results",
      emptyStateTitle: "No products match your filters",
      emptyStateDescription: "Adjust the filters or add a new product to your inventory.",
      paginationLabel: "Inventory pagination",
      summaryTitle: "Inventory status",
      summaryExpiringSoon: "Expiring soon",
      summaryLowStock: "Low stock",
      summaryInStock: "In stock",
      paginationPage: "Page",
      expirationAll: "All products",
      expiration7: "≤ 7 days",
      expiration14: "≤ 14 days",
      expiration30: "≤ 30 days",
      expirationSegmentLabel: "Expires in",
      errorTitle: "Unable to load inventory",
      errorDescription: "Please try again or contact support if the issue persists.",
    },
    productCard: {
      stockLabel: "Stock",
      unitLabel: "units",
      priceLabel: "Price",
      statusOk: "OK",
      statusWarning: "Check",
      ariaPrefix: "Product",
      moreActions: "More actions",
    },
    productDetails: {
      title: "Product details",
      barcodeLabel: "Barcode",
      skuLabel: "SKU",
      categoryLabel: "Category",
      stockLabel: "Current stock",
      allergensLabel: "Allergens",
      allergensNone: "No allergens declared",
      ecoScoreLabel: "Eco-score",
      supplierLabel: "Supplier",
      locationLabel: "Storage location",
      reorderPointLabel: "Reorder point",
      updatedAtLabel: "Last updated",
      close: "Close",
    },
    haccp: frLocales.haccp,
    menus: frLocales.menus,
    allergens: {
      gluten: "Gluten",
      lactose: "Lactose",
      nuts: "Tree nuts",
      shellfish: "Shellfish",
      soy: "Soy",
      egg: "Egg",
      fish: "Fish",
      vegan: "Plant-based",
      poison: "High risk",
    },
    categories: {
      produce: "Fresh produce",
      dairy: "Dairy",
      protein: "Proteins",
      dry: "Dry goods",
      beverage: "Beverages",
      condiments: "Condiments",
      bakery: "Bakery",
      prepared: "Prepared meals",
    },
  },
} as const;

export type Locale = keyof typeof dictionaries;

export type Dictionary = (typeof dictionaries)[Locale];

export type TranslationScope = keyof Dictionary;

export type AllergenCode = keyof typeof dictionaries.en.allergens;

export type CategoryCode = keyof typeof dictionaries.en.categories;

const SUPPORTED_LOCALES: ReadonlyArray<Locale> = ["en", "fr"];

const FALLBACK_LOCALE: Locale = "en";

export function getScopedDictionary<K extends TranslationScope>(scope: K, locale: Locale = FALLBACK_LOCALE): Dictionary[K] {
  return dictionaries[locale][scope];
}

export function availableLocales(): Locale[] {
  return [...SUPPORTED_LOCALES];
}

export { dictionaries };
export { SUPPORTED_LOCALES, FALLBACK_LOCALE };
