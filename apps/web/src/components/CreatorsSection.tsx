import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@lexasafe/motion";
import { CREATORS, type Creator } from "@/content/creators";

function FlipCard({ creator }: { creator: Creator }) {
  return (
    <div
      className="group mx-auto w-full max-w-sm [perspective:1400px]"
      tabIndex={0}
      aria-label={`Profil de ${creator.name}`}
    >
      <div className="relative aspect-[3/4] w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
        {/* Face avant — photo + pseudo */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_12px_40px_rgba(132,175,251,0.12)] [backface-visibility:hidden]">
          <img
            src={creator.portrait}
            alt={creator.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-navy/85 via-blue-navy/40 to-transparent p-6 pt-20">
            <h3 className="font-display text-2xl font-bold text-white">{creator.name}</h3>
          </div>
        </div>

        {/* Face arrière — description */}
        <div className="absolute inset-0 flex flex-col justify-center gap-4 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white via-[#FBF8F4] to-[#84AFFB]/30 p-8 shadow-[0_12px_40px_rgba(132,175,251,0.15)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h3 className="font-display text-2xl font-bold text-blue-navy">{creator.name}</h3>
          <p className="text-sm leading-relaxed text-text-secondary">{creator.desc}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {creator.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-blue-border bg-white/80 px-2.5 py-1 text-xs font-bold text-blue-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreatorsSection() {
  return (
    <section
      className="border-t border-border-subtle bg-gradient-to-b from-white via-[#FBF8F4] to-[#F5F9FF] py-24"
      id="creators"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              L&apos;Équipe Fondatrice
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-5xl">
              Les Bâtisseurs de LexaSafe
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Deux étudiants français en BTS, bâtisseurs d&apos;une souveraineté numérique sans concession.
            </p>
          </div>
        </FadeUp>

        <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
          {CREATORS.map((c) => (
            <FadeUp key={c.name}>
              <FlipCard creator={c} />
            </FadeUp>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-text-muted">
          Passez la souris sur une carte pour en savoir plus.
        </p>

        <FadeUp>
          <div className="mt-14 flex justify-center">
            <Link
              href="/createurs"
              className="group inline-flex items-center gap-2 rounded-pill bg-blue-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_6px_24px_rgba(2,89,221,0.28)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Découvrir les profils
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
