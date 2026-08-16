import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { AmbientBackground } from "@lexasafe/ui";
import { FadeUp } from "@lexasafe/motion";
import { CREATORS } from "@/content/creators";
import { CreatorCard } from "@/components/CreatorCard";

export const metadata = {
  title: "Les Bâtisseurs de LexaSafe | L'Équipe Fondatrice",
  description:
    "Découvrez l'équipe fondatrice de LexaSafe : deux étudiants français bâtisseurs d'une souveraineté numérique sans concession.",
};

export default function CreateursPage() {
  return (
    <>
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="rounded-pill border border-white/30 bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-navy">
            <ArrowLeft className="h-4 w-4" />
            Retour Accueil
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-36">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              L&apos;Équipe Fondatrice
            </span>
            <h1 className="font-display text-4xl font-extrabold text-blue-navy md:text-5xl">
              Les Bâtisseurs de LexaSafe
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Deux étudiants français en BTS, bâtisseurs d&apos;une souveraineté numérique sans concession.
              Retrouvez leurs profils, portfolios et LinkedIn ci-dessous.
            </p>
          </div>
        </FadeUp>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {CREATORS.map((c, i) => (
            <CreatorCard key={c.name} creator={c} index={i} />
          ))}
        </div>

        <FadeUp index={2}>
          <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-blue-border bg-bg-blue-tint px-8 py-10 text-center">
            <p className="max-w-md text-sm text-text-secondary">
              Une question, un partenariat ou une demande presse ? Contactez directement les fondateurs.
            </p>
            <a
              href="mailto:contact@lexasafe.fr"
              className="inline-flex items-center gap-2 rounded-pill bg-blue-primary px-6 py-3 text-sm font-bold text-white shadow-[0_6px_24px_rgba(2,89,221,0.28)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contacter les fondateurs
            </a>
          </div>
        </FadeUp>
      </main>
    </>
  );
}
