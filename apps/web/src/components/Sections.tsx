"use client";

import { ShieldCheck, Landmark, Scale } from "lucide-react";
import { FadeUp, TiltGlassCard, TiltCardItem } from "@lexasafe/motion";
import { useI18n } from "@/i18n/I18nProvider";

export function AdvantagesSection() {
  const { t } = useI18n();
  const a = t.advantages;
  const icons = [ShieldCheck, Landmark, Scale];
  const iconClass = ["text-blue-primary", "text-blue-accent", "text-crimson-threat"];

  return (
    <section className="border-t border-border-subtle bg-gradient-to-b from-[#FBF8F4] via-white to-[#F5F9FF] py-28" id="avantages">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <span className="mb-6 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              {a.badge}
            </span>
            <h2 className="gsap-copy font-display text-4xl font-extrabold tracking-tight text-blue-navy md:text-6xl">
              {a.title}
            </h2>
          </div>
        </FadeUp>

        <div className="grid gap-6 md:auto-rows-fr md:grid-cols-3 md:items-stretch">
          {a.items.map((item, i) => {
            const Icon = icons[i] ?? ShieldCheck;
            return (
              <TiltGlassCard key={item.title} index={i} className="adv-card" enterWithGsap>
                <div className="flex flex-col gap-4">
                  <TiltCardItem>
                    <Icon className={`h-14 w-14 ${iconClass[i]}`} strokeWidth={1.5} />
                  </TiltCardItem>
                  <TiltCardItem>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight text-blue-navy">
                      {item.title}
                    </h3>
                  </TiltCardItem>
                  <TiltCardItem>
                    <p className="text-sm leading-relaxed text-text-secondary">{item.text}</p>
                  </TiltCardItem>
                </div>
              </TiltGlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection() {
  const { t } = useI18n();
  const w = t.workflow;
  const badgeClass = [
    "bg-blue-primary text-white border-blue-primary",
    "bg-white text-blue-navy border-2 border-blue-navy",
    "bg-crimson-threat text-white border-crimson-threat",
  ];

  return (
    <section className="border-t border-border-subtle bg-white/60 py-24 backdrop-blur-sm" id="workflow">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              {w.badge}
            </span>
            <h2 className="gsap-copy font-display text-3xl font-extrabold text-blue-navy md:text-5xl">{w.title}</h2>
          </div>
        </FadeUp>
        <div className="grid gap-5 md:grid-cols-3">
          {w.steps.map((s, i) => (
            <TiltGlassCard key={s.title} index={i} className="wf-step" enterWithGsap>
              <TiltCardItem>
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-lg font-extrabold ${badgeClass[i]}`}
                >
                  {i + 1}
                </div>
              </TiltCardItem>
              <TiltCardItem>
                <h3 className="font-display text-lg font-bold text-blue-navy">{s.title}</h3>
              </TiltCardItem>
              <TiltCardItem>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{s.text}</p>
              </TiltCardItem>
            </TiltGlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
