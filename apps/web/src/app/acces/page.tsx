import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, BadgeCheck, PlayCircle } from "lucide-react";
import { AmbientBackground } from "@lexasafe/ui";
import { FadeUp } from "@lexasafe/motion";

export const metadata = {
  title: "Créer un compte / Devis | LexaSafe",
  description:
    "Choisissez votre parcours d'accès à LexaSafe : inscription entreprise (devis souverain) ou compte officier de police judiciaire vérifié.",
};

const CHOICES = [
  {
    href: "/inscription/entreprise",
    icon: Building2,
    eyebrow: "Entreprise · Secteur public / privé",
    title: "Inscription Entreprise & Devis",
    desc: "Obtenez un devis souverain sur mesure et créez l'accès de votre organisation (DPO, service juridique). Contrôle SIREN/SIRET et email professionnel.",
    cta: "Demander un devis",
    accent: "text-blue-primary",
    iconBg: "bg-bg-blue-tint",
    border: "hover:border-blue-primary",
  },
  {
    href: "/inscription/opj",
    icon: BadgeCheck,
    eyebrow: "Forces de l'ordre · Accès gratuit",
    title: "Compte Officier (OPJ)",
    desc: "Réservé aux officiers de police judiciaire. Vérification anti-usurpation : email @*.gouv.fr, matricule, unité, et validation manuelle par un administrateur.",
    cta: "Créer mon compte OPJ",
    accent: "text-blue-primary",
    iconBg: "bg-bg-blue-tint",
    border: "hover:border-blue-primary",
  },
];

export default function AccesPage() {
  return (
    <>
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="rounded-pill border border-white/30 bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-blue-navy">
            <ArrowLeft className="h-4 w-4" />
            Retour Accueil
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32">
        <FadeUp>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Accès souverain
            </span>
            <h1 className="font-display text-4xl font-extrabold text-blue-navy md:text-5xl">
              Créer un compte / Demander un devis
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Deux parcours sécurisés, chacun avec les vérifications requises. Choisissez le vôtre.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-2">
          {CHOICES.map((c, i) => (
            <FadeUp key={c.href} index={i}>
              <Link
                href={c.href}
                className={`group flex h-full flex-col rounded-2xl border border-white/50 bg-white/70 p-8 shadow-[0_8px_40px_rgba(2,89,221,0.08)] backdrop-blur-xl transition-colors ${c.border}`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${c.iconBg} ${c.accent}`}>
                  <c.icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-wider text-blue-accent">{c.eyebrow}</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-blue-navy">{c.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{c.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-primary">
                  {c.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp index={2}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-blue-border bg-bg-blue-tint px-8 py-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-primary">
                <PlayCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-base font-bold text-blue-navy">Vous préférez voir d&apos;abord ?</p>
                <p className="text-sm text-text-secondary">Demandez une démonstration guidée de la plateforme.</p>
              </div>
            </div>
            <Link
              href="/demo"
              className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-blue-primary bg-white px-6 py-3 text-sm font-bold text-blue-primary transition-colors hover:bg-blue-primary hover:text-white"
            >
              Voir une démo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeUp>
      </main>
    </>
  );
}
