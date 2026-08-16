"use client";

import type { ReactNode } from "react";
import { ArrowRight, Calculator, Flag, Lock, Scale, ShieldCheck, ShieldX, Zap } from "lucide-react";
import { FadeUp, TextRevealBlock, motion } from "@lexasafe/motion";
import { useI18n } from "@/i18n/I18nProvider";

const CHIP_ICONS = [Flag, Lock, Scale, ShieldCheck];

export function HeroSection({ title }: { title: ReactNode }) {
  const { t } = useI18n();
  const h = t.hero;

  const stats = [
    {
      icon: Zap,
      title: h.stats[0].title,
      sub: h.stats[0].sub,
      iconBg: "bg-bg-blue-tint",
      iconColor: "text-blue-primary",
      titleColor: "text-blue-primary",
    },
    {
      icon: ShieldCheck,
      title: h.stats[1].title,
      sub: h.stats[1].sub,
      iconBg: "bg-blue-accent/20",
      iconColor: "text-blue-accent",
      titleColor: "text-blue-primary",
    },
    {
      icon: ShieldX,
      title: h.stats[2].title,
      subTitle: h.stats[2].subTitle,
      sub: h.stats[2].sub,
      iconBg: "bg-crimson-bg",
      iconColor: "text-crimson-threat",
      titleColor: "text-crimson-threat text-4xl md:text-5xl leading-none",
    },
  ];

  return (
    <section className="relative overflow-hidden pb-24 pt-28 md:pt-36" id="hero">
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 text-[13px] font-semibold uppercase leading-none tracking-[0.26em] text-text-muted"
          >
            <TextRevealBlock delay={0.2}>{h.kicker}</TextRevealBlock>
          </motion.div>

          {title}

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-3xl text-lg text-text-secondary md:text-xl"
          >
            {h.leadBefore}
            <strong>{h.leadStrong1}</strong>
            {h.leadMid}
            <strong>{h.leadStrong2}</strong>
            {h.leadHost}
            <strong>{h.leadStrong3}</strong>
            {h.leadZero}
            <strong>{h.leadStrong4}</strong>
            {h.leadEnd}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap justify-start gap-4"
          >
            <a
              href="/acces"
              className="hero-shine-btn inline-flex items-center gap-2 rounded-pill bg-blue-primary px-8 py-4 text-lg font-semibold text-white shadow-[0_4px_24px_rgba(2,89,221,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-hover hover:shadow-[0_8px_28px_rgba(2,89,221,0.4)]"
            >
              {h.cta}
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 rounded-pill border border-border-medium bg-white/80 px-6 py-4 font-semibold text-blue-navy backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-primary hover:text-blue-primary"
            >
              <Calculator className="h-5 w-5" />
              <span>{h.simulate}</span>
            </a>
          </motion.div>

          <FadeUp index={0}>
            <div className="mt-10 flex flex-wrap justify-start gap-3">
              {h.chips.map((text, i) => {
                const Icon = CHIP_ICONS[i] ?? Flag;
                return (
                  <motion.div
                    key={text}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="flex items-center gap-2 rounded-pill border border-blue-border bg-white/70 px-4 py-2 text-sm font-semibold text-blue-navy backdrop-blur-sm"
                  >
                    <Icon className="h-4 w-4 text-blue-primary" />
                    {text}
                  </motion.div>
                );
              })}
            </div>
          </FadeUp>

          <FadeUp index={1}>
            <div className="mt-12 grid gap-4 md:grid-cols-3 md:items-stretch">
              {stats.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40, rotateX: 12 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12, type: "spring", stiffness: 80, damping: 16 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="flex h-full items-center gap-4 rounded-xl border border-white/50 bg-white/40 p-5 backdrop-blur-2xl"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <div className="text-left">
                    <div className={`font-display font-bold ${card.titleColor}`}>{card.title}</div>
                    {"subTitle" in card && card.subTitle && (
                      <div className="font-display text-lg font-bold text-crimson-threat">{card.subTitle}</div>
                    )}
                    <div className="text-sm text-text-secondary">{card.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
