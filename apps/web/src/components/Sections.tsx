"use client";

import { ShieldCheck, Landmark, Scale } from "lucide-react";
import { FadeUp, TiltGlassCard, TiltCardItem } from "@lexasafe/motion";

export function AdvantagesSection() {
  return (
    <section className="border-t border-border-subtle bg-gradient-to-b from-[#FBF8F4] via-white to-[#F5F9FF] py-28" id="avantages">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <span className="mb-6 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Enterprise-Grade
            </span>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-blue-navy md:text-6xl">
              Pourquoi Choisir LexaSafe ?
            </h2>
          </div>
        </FadeUp>

        <div className="grid gap-6 md:auto-rows-fr md:grid-cols-3 md:items-stretch">
          <TiltGlassCard index={0}>
            <div className="flex flex-col gap-4">
              <TiltCardItem>
                <ShieldCheck className="h-14 w-14 text-blue-primary" strokeWidth={1.5} />
              </TiltCardItem>
              <TiltCardItem>
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-blue-navy">
                  Sécurité inviolable
                </h3>
              </TiltCardItem>
              <TiltCardItem>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Chiffrement E2EE Zéro Connaissance et scellement eIDAS SHA-256.
                </p>
              </TiltCardItem>
            </div>
          </TiltGlassCard>

          <TiltGlassCard index={1}>
            <div className="flex flex-col gap-4">
              <TiltCardItem>
                <Landmark className="h-14 w-14 text-blue-accent" strokeWidth={1.5} />
              </TiltCardItem>
              <TiltCardItem>
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-blue-navy">
                  100% Souverain
                </h3>
              </TiltCardItem>
              <TiltCardItem>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Hébergé OVHcloud SecNumCloud, immunité au CLOUD Act.
                </p>
              </TiltCardItem>
            </div>
          </TiltGlassCard>

          <TiltGlassCard index={2}>
            <div className="flex flex-col gap-4">
              <TiltCardItem>
                <Scale className="h-14 w-14 text-crimson-threat" strokeWidth={1.5} />
              </TiltCardItem>
              <TiltCardItem>
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-blue-navy">
                  Amendes RGPD évitées
                </h3>
              </TiltCardItem>
              <TiltCardItem>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Conformité e-Evidence et CPP Art. 60-1 garantie.
                </p>
              </TiltCardItem>
            </div>
          </TiltGlassCard>
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection() {
  const steps = [
    {
      n: 1,
      title: "Dépôt Sécurisé par l'OPJ",
      text: "L'Officier dépose sa réquisition officielle sur le portail sécurisé LexaSafe (gratuit pour les forces de l'ordre).",
      badgeClass: "bg-blue-primary text-white border-blue-primary",
    },
    {
      n: 2,
      title: "Authentification & Zéro Connaissance",
      text: "LexaSafe authentifie cryptographiquement l'officier et neutralise les faux policiers. Tunnel E2EE étanche.",
      badgeClass: "bg-white text-blue-navy border-2 border-blue-navy",
    },
    {
      n: 3,
      title: "Remise Chiffrée & Scellée",
      text: "Votre entreprise génère l'archive .ZIP scellée eIDAS en 1 clic avec horodatage probatoire.",
      badgeClass: "bg-crimson-threat text-white border-crimson-threat",
    },
  ];

  return (
    <section className="border-t border-border-subtle bg-white/60 py-24 backdrop-blur-sm" id="workflow">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Canaux Sécurisés
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-5xl">
              Comment Fonctionne LexaSafe en 3 Étapes
            </h2>
          </div>
        </FadeUp>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <TiltGlassCard key={s.n} index={i}>
              <TiltCardItem>
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-lg font-extrabold ${s.badgeClass}`}
                >
                  {s.n}
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
