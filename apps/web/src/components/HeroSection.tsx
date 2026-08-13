"use client";

import { ArrowRight, Calculator, Flag, Lock, Scale, ShieldCheck, ShieldX, Zap } from "lucide-react";
import { FadeUp, MagneticButton } from "@lexasafe/motion";
export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32" id="hero">
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <FadeUp index={0}>
          <div className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
            <span>La passerelle souveraine pour vos</span>
            <span className="font-display font-bold text-blue-primary">Réquisitions Judiciaires</span>
          </div>
        </FadeUp>

        <FadeUp index={1}>
          <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-blue-navy md:text-6xl">
            Sécurisez &amp; Automatisez vos{" "}
            <span className="bg-gradient-to-r from-blue-primary to-blue-electric bg-clip-text text-transparent">
              Réquisitions Légales.
            </span>
          </h1>
        </FadeUp>

        <FadeUp index={2}>
          <p className="mt-6 max-w-3xl text-lg text-text-secondary">
            Le standard <strong>100% français et souverain</strong>, taillé pour la{" "}
            <strong>nouvelle loi européenne e-Evidence</strong>. Hébergé chez{" "}
            <strong>OVHcloud SecNumCloud</strong> avec garantie <strong>Zéro Connaissance</strong>.
          </p>
        </FadeUp>

        <FadeUp index={3}>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton
              href="/demo"
              className="inline-flex items-center gap-2 rounded-pill bg-blue-primary px-8 py-4 text-lg font-semibold text-white shadow-[0_4px_18px_rgba(29,78,216,0.28)]"
            >
              <span>Demander une démo</span>
              <ArrowRight className="h-5 w-5" />
            </MagneticButton>
            <MagneticButton
              href="#calculator"
              className="inline-flex items-center gap-2 rounded-pill border border-border-medium bg-white px-6 py-4 font-semibold text-blue-navy"
            >
              <Calculator className="h-5 w-5" />
              <span>Simuler vos Économies</span>
            </MagneticButton>
          </div>
        </FadeUp>

        <FadeUp index={4}>
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { icon: Flag, text: "100% Souverain Français" },
              { icon: Lock, text: "Canaux sécurisés E2EE" },
              { icon: Scale, text: "Loi e-Evidence 2026" },
              { icon: ShieldCheck, text: "Évitez l'amende de 2% du CA" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-pill border border-blue-border bg-white/70 px-4 py-2 text-sm font-semibold text-blue-navy backdrop-blur-sm"
              >
                <Icon className="h-4 w-4 text-blue-primary" />
                {text}
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp index={5}>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-white/70 p-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-blue-tint">
                <Zap className="h-6 w-6 text-blue-primary" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-blue-primary">Plus rapide</div>
                <div className="text-sm text-text-secondary">Traitement immédiat</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-white/70 p-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-bg">
                <ShieldCheck className="h-6 w-6 text-emerald-valid" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-emerald-valid">100%</div>
                <div className="text-sm text-text-secondary">Souverain SecNumCloud</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-white/70 p-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-bg">
                <ShieldX className="h-6 w-6 text-crimson-threat" />
              </div>
              <div>
                <div className="font-display text-4xl font-extrabold leading-none text-crimson-threat md:text-5xl">
                  0
                </div>
                <div className="font-display text-lg font-bold text-crimson-threat">Faux OPJ</div>
                <div className="text-sm text-text-secondary">Zéro fraude passée</div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
