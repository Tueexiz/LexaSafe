"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/messages";

const OPTIONS: { id: Locale; native: string }[] = [
  { id: "fr", native: "Français" },
  { id: "en", native: "English" },
];

export function LanguageSwitcher({
  inverted = false,
  align = "left",
}: {
  inverted?: boolean;
  align?: "left" | "right";
}) {
  const { locale, t, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.nav.language}
        className={`ios-glass relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold tracking-wide transition ${
          inverted ? "text-white" : "text-blue-navy"
        }`}
      >
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        {locale === "en" ? t.nav.en : t.nav.fr}
        <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          className={`absolute top-[calc(100%+8px)] z-50 min-w-[9.5rem] overflow-hidden rounded-2xl border border-white/70 bg-white/90 py-1 shadow-[0_12px_40px_rgba(10,37,64,0.12)] backdrop-blur-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {OPTIONS.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                role="option"
                aria-selected={locale === opt.id}
                onClick={() => {
                  setLocale(opt.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                  locale === opt.id ? "font-bold text-blue-primary" : "text-blue-navy hover:bg-bg-blue-tint"
                }`}
              >
                <span>{opt.native}</span>
                <span className="text-xs text-text-muted">{opt.id.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
