import { EyeOff, Flag, Scale, ShieldCheck } from "lucide-react";
import { FadeUp } from "@lexasafe/motion";
import { GlassCard } from "@lexasafe/ui";

const features = [
  {
    icon: Flag,
    title: "100% Souverain • OVHcloud",
    text: "Hébergé sur serveurs français qualifiés SecNumCloud ANSSI. Immunité totale face au CLOUD Act.",
    color: "bg-bg-blue-tint text-blue-primary",
  },
  {
    icon: Scale,
    title: "Conforme Loi e-Evidence",
    text: "Nativement taillé pour le Règlement Européen e-Evidence et CPP Art. 60-1 / 60-2.",
    color: "bg-emerald-bg text-emerald-valid",
  },
  {
    icon: EyeOff,
    title: "Zéro Connaissance",
    text: "Nous ne savons pas ce qui transite. Chiffrement E2EE de bout en bout.",
    color: "bg-bg-blue-tint text-blue-primary",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Audité & Sécurité",
    text: "Scellement SHA-256 eIDAS, journal d'audit infalsifiable, protection anti-usurpation.",
    color: "bg-emerald-bg text-emerald-valid",
  },
];

export function AdvantagesSection() {
  return (
    <section className="border-t border-border-subtle bg-white py-24" id="avantages">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Souveraineté Française
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">
              Pourquoi Choisir LexaSafe ?
            </h2>
          </div>
        </FadeUp>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <FadeUp key={f.title} index={i}>
              <GlassCard className="h-full">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-blue-navy">{f.title}</h3>
                </div>
                <p className="text-sm text-text-secondary">{f.text}</p>
              </GlassCard>
            </FadeUp>
          ))}
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
      badgeClass: "bg-[#1d4ed8] text-white border-[#1d4ed8]",
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
      badgeClass: "bg-[#dc2626] text-white border-[#dc2626]",
    },
  ];

  return (
    <section className="border-t border-border-subtle bg-bg-subtle py-24" id="workflow">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Canaux Sécurisés
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">
              Comment Fonctionne LexaSafe en 3 Étapes
            </h2>
          </div>
        </FadeUp>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <FadeUp key={s.n} index={i}>
              <GlassCard className="h-full min-h-[220px]">
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-lg font-extrabold ${s.badgeClass}`}
                >
                  {s.n}
                </div>
                <h3 className="font-display text-lg font-bold text-blue-navy">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{s.text}</p>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
