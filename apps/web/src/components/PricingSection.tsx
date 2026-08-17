"use client";

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeUp } from "@lexasafe/motion";
import { GlassCard } from "@lexasafe/ui";
import { useI18n } from "@/i18n/I18nProvider";

export function PricingSection() {
  const { t } = useI18n();
  const p = t.pricing;

  return (
    <section className="py-24" id="tarifs">
      <div className="container mx-auto max-w-3xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              {p.badge}
            </span>
            <h2 className="gsap-copy font-display text-3xl font-extrabold text-blue-navy md:text-4xl">{p.title}</h2>
            <p className="gsap-copy mt-4 text-lg text-text-secondary">{p.subtitle}</p>
          </div>
        </FadeUp>
        <FadeUp index={1}>
          <GlassCard className="flex flex-col border-blue-primary ring-2 ring-blue-primary/20" padding="lg">
            <span className="mb-4 inline-block w-fit rounded-pill bg-blue-primary px-3 py-1 text-xs font-bold text-white">
              {p.tag}
            </span>
            <div className="font-display text-4xl font-extrabold text-blue-primary">{p.price}</div>
            <p className="mt-2 text-sm text-text-secondary">{p.priceLead}</p>
            <ul className="my-8 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-bold text-blue-navy">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/acces"
              className="hero-shine-btn inline-flex w-full items-center justify-center gap-2 rounded-pill bg-blue-primary py-3.5 font-bold text-white transition hover:bg-blue-hover"
            >
              {p.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        </FadeUp>
      </div>
    </section>
  );
}
