"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import { LOCALE_NAMES, locales } from "@/i18n/config";
import { setLocale } from "@/app/actions/i18n-action";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [pending, startTransition] = useTransition();

  return (
    <label className={`relative flex justify-between items-center ${className}`}>
      <Globe className="pointer-events-none absolute left-3 size-4" aria-hidden />
      <select
        value={locale}
        disabled={pending}
        onChange={(e) => startTransition(() => setLocale(e.target.value))}
        className="h-9 cursor-pointer appearance-none rounded-md border bg-white pl-9 pr-8 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {LOCALE_NAMES[l]}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute left-25 size-4" aria-hidden />
    </label>
  );
}