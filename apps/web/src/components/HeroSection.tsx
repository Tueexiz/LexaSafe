"use client";

import type { ReactNode } from "react";
import { ArrowRight, Calculator, Flag, Lock, Scale, ShieldCheck, ShieldX, Zap } from "lucide-react";
import {
  FadeUp,
  MagneticButton,
  ShineMagneticButton,
  TextRevealBlock,
  motion,
} from "@lexasafe/motion";

export function HeroSection({ title }: { title: ReactNode }) {
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
            <TextRevealBlock delay={0.2}>
              Passerelle souveraine · Réquisitions Judiciaires
            </TextRevealBlock>
          </motion.div>

          {title}

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-3xl text-lg text-text-secondary md:text-xl"
          >
            Le standard <strong>100% français et souverain</strong>, taillé pour la{" "}
            <strong>nouvelle loi européenne e-Evidence</strong>. Hébergé chez{" "}
            <strong>OVHcloud SecNumCloud</strong> avec garantie <strong>Zéro Connaissance</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap justify-start gap-4"
          >
            <ShineMagneticButton
              href="/acces"
              className="rounded-pill bg-blue-primary px-8 py-4 text-lg font-semibold text-white shadow-[0_4px_24px_rgba(2,89,221,0.35)]"
            >
              Créer un compte / Devis
              <ArrowRight className="h-5 w-5" />
            </ShineMagneticButton>
            <MagneticButton
              href="#calculator"
              data-cursor="magnetic"
              className="inline-flex items-center gap-2 rounded-pill border border-border-medium bg-white/80 px-6 py-4 font-semibold text-blue-navy backdrop-blur-sm"
            >
              <Calculator className="h-5 w-5" />
              <span>Simuler vos Économies</span>
            </MagneticButton>
          </motion.div>

          <FadeUp index={0}>
            <div className="mt-10 flex flex-wrap justify-start gap-3">
              {[
                { icon: Flag, text: "100% Souverain Français" },
                { icon: Lock, text: "Canaux sécurisés E2EE" },
                { icon: Scale, text: "Loi e-Evidence 2026" },
                { icon: ShieldCheck, text: "Évitez l'amende de 2% du CA" },
              ].map(({ icon: Icon, text }) => (
                <motion.div
                  key={text}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="flex items-center gap-2 rounded-pill border border-blue-border bg-white/70 px-4 py-2 text-sm font-semibold text-blue-navy backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 text-blue-primary" />
                  {text}
                </motion.div>
              ))}
            </div>
          </FadeUp>

          <FadeUp index={1}>
            <div className="mt-12 grid gap-4 md:grid-cols-3 md:items-stretch">
              {[
                {
                  icon: Zap,
                  title: "Plus rapide",
                  sub: "Traitement immédiat",
                  iconBg: "bg-bg-blue-tint",
                  iconColor: "text-blue-primary",
                  titleColor: "text-blue-primary",
                },
                {
                  icon: ShieldCheck,
                  title: "100%",
                  sub: "Souverain SecNumCloud",
                  iconBg: "bg-blue-accent/20",
                  iconColor: "text-blue-accent",
                  titleColor: "text-blue-primary",
                },
                {
                  icon: ShieldX,
                  title: "0",
                  subTitle: "Fraudes",
                  sub: "Aucune fraude passée",
                  iconBg: "bg-crimson-bg",
                  iconColor: "text-crimson-threat",
                  titleColor: "text-crimson-threat text-4xl md:text-5xl leading-none",
                },
              ].map((card, i) => (
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
