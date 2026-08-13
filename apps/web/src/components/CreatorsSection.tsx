import Link from "next/link";
import { FadeUp } from "@lexasafe/motion";
import { CREATORS } from "@/content/creators";
import { CreatorCard } from "@/components/CreatorCard";

export function CreatorsSection() {
  return (
    <section className="border-t border-border-subtle bg-bg-subtle py-24" id="creators">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              L&apos;Équipe Fondatrice
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">
              Les Bâtisseurs de LexaSafe
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Deux étudiants français en BTS, bâtisseurs d&apos;une souveraineté numérique sans concession.
            </p>
          </div>
        </FadeUp>
        <div className="grid gap-8 md:grid-cols-2">
          {CREATORS.map((c, i) => (
            <FadeUp key={c.name} index={i}>
              <CreatorCard creator={c} layout="vertical" />
            </FadeUp>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/createurs" className="text-sm font-semibold text-blue-primary hover:underline">
            Découvrir le profil détaillé →
          </Link>
        </div>
      </div>
    </section>
  );
}
