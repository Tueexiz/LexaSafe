import Link from "next/link";
import { Mail } from "lucide-react";
import { AmbientBackground } from "@lexasafe/ui";
import { FadeUp } from "@lexasafe/motion";
import { CREATORS } from "@/content/creators";
import { CreatorCard } from "@/components/CreatorCard";

export default function CreateursPage() {
  return (
    <>
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="rounded-pill border border-white/30 bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold text-blue-navy">
            ← Retour Accueil
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-32">
        <FadeUp>
          <h1 className="font-display text-4xl font-extrabold text-blue-navy">L&apos;Équipe Fondatrice</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">
            Deux étudiants français en BTS, bâtisseurs d&apos;une souveraineté numérique sans concession.
          </p>
        </FadeUp>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {CREATORS.map((c, i) => (
            <FadeUp key={c.name} index={i}>
              <CreatorCard creator={c} layout="vertical" />
            </FadeUp>
          ))}
        </div>
        <FadeUp index={2}>
          <div className="mt-12 flex justify-center rounded-2xl border border-blue-border bg-bg-blue-tint p-8">
            <a
              href="mailto:contact@lexasafe.fr"
              aria-label="Contacter les fondateurs"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-blue-border bg-white text-blue-primary shadow-sm transition-colors hover:bg-white/90 hover:text-blue-navy"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </FadeUp>
      </main>
    </>
  );
}
