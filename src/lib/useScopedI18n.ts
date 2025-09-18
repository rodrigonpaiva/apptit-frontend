"use client";

import { useEffect, useMemo, useState } from "react";
import {
  dictionaries,
  type Dictionary,
  type Locale,
  type TranslationScope,
  SUPPORTED_LOCALES,
  FALLBACK_LOCALE,
} from "@/src/lib/i18n";

function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function normalizeLocale(raw?: string | null): Locale {
  if (!raw) {
    return FALLBACK_LOCALE;
  }

  const lowerCased = raw.toLowerCase();
  const base = lowerCased.split("-")[0];

  return isLocale(base) ? base : FALLBACK_LOCALE;
}

function resolveInitialLocale(): Locale {
  if (typeof document !== "undefined") {
    return normalizeLocale(document.documentElement.lang);
  }

  if (typeof navigator !== "undefined") {
    return normalizeLocale(navigator.language);
  }

  return FALLBACK_LOCALE;
}

function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(() => resolveInitialLocale());

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const nextLocale = normalizeLocale(document.documentElement.lang);

    setLocale((current) => (current === nextLocale ? current : nextLocale));
  }, []);

  return locale;
}

export function useScopedI18n<K extends TranslationScope>(scope: K): Dictionary[K] {
  const locale = useLocale();

  return useMemo(() => dictionaries[locale][scope], [locale, scope]);
}
