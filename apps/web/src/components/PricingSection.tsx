import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeUp } from "@lexasafe/motion";
import { GlassCard } from "@lexasafe/ui";

const features = [
  "Traitement illimité des réquisitions OPJ",
  "Tunnel Zero-Knowledge E2EE",
  "Authentification certifiée des officiers",
  "Archives scellées eIDAS",
  "Registre légal CNIL",
  "Support juridique & technique 7j/7",
  "Hébergement OVHcloud SecNumCloud",
  "Abonnement annuel lissé mensuellement",
];

export function PricingSection() {
  return (
    <section className="py-24" id="tarifs">
      <div className="container mx-auto max-w-3xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Offre Phare
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">
              Abonnement SaaS Souverain
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              La passerelle clé en main hébergée en France chez OVHcloud SecNumCloud.
            </p>
          </div>
        </FadeUp>
        <FadeUp index={1}>
          <GlassCard
            className="flex flex-col border-blue-primary ring-2 ring-blue-primary/20"
            padding="lg"
          >
            <span className="mb-4 inline-block w-fit rounded-pill bg-blue-primary px-3 py-1 text-xs font-bold text-white">
              Standard Souverain — Recommandé
            </span>
            <div className="font-display text-4xl font-extrabold text-blue-primary">Sur Mesure</div>
            <p className="mt-2 text-sm text-text-secondary">
              Tarification transparente adaptée à votre volume de réquisitions et à votre taille d&apos;entreprise.
            </p>
            <ul className="my-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-valid" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/inscription/entreprise"
              className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-blue-primary py-3.5 font-bold text-white transition hover:bg-blue-hover"
            >
              Demander un devis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        </FadeUp>
      </div>
    </section>
  );
}
