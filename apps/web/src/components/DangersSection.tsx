"use client";

import { AlertOctagon, AlertTriangle, TimerOff, UserX } from "lucide-react";
import { FadeUp } from "@lexasafe/motion";
import { GlassCard } from "@lexasafe/ui";
import { useI18n } from "@/i18n/I18nProvider";

const ICONS = [AlertOctagon, UserX, TimerOff];

export function DangersSection() {
  const { t } = useI18n();
  const d = t.dangers;

  return (
    <section className="border-t border-border-subtle bg-bg-subtle py-24" id="dangers">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-pill border border-crimson-border bg-crimson-bg px-4 py-1.5 text-sm font-bold text-crimson-threat">
              <AlertTriangle className="h-4 w-4" />
              {d.badge}
            </div>
            <h2 className="gsap-copy font-display text-3xl font-extrabold text-blue-navy md:text-4xl">{d.title}</h2>
          </div>
        </FadeUp>
        <div className="grid gap-6 md:grid-cols-3">
          {d.items.map((item, i) => {
            const Icon = ICONS[i] ?? AlertOctagon;
            return (
              <div key={item.title} className="danger-card h-full">
                <GlassCard className="h-full border-crimson-border/30 bg-white/80">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-bg text-crimson-threat">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase text-crimson-threat">{item.badge}</span>
                  <h3 className="mt-1 font-display text-lg font-bold text-blue-navy">{item.title}</h3>
                  <p className="mt-3 text-sm text-text-secondary">{item.text}</p>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
