import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { AmbientBackground } from "@lexasafe/ui";
import { CREATORS } from "@/content/creators";
import { CreatorCard } from "@/components/CreatorCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getMessages } from "@/i18n/server";

export const metadata = {
  title: "Les Bâtisseurs de LexaSafe | L'Équipe Fondatrice",
  description:
    "Découvrez l'équipe fondatrice de LexaSafe : deux étudiants français bâtisseurs d'une souveraineté numérique sans concession.",
};

export default async function CreateursPage() {
  const { t } = await getMessages();
  const c = t.creators;

  return (
    <div className="relative h-dvh overflow-hidden">
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-1.5 z-50 flex justify-center gap-2 px-4">
        <div className="flex items-center gap-2 rounded-pill border border-white/30 bg-white/90 px-3 py-1.5 shadow-capsule backdrop-blur-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-navy">
            <ArrowLeft className="h-4 w-4" />
            {t.common.backHome}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex h-dvh max-w-5xl flex-col px-6 pb-10 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-1.5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-primary">
            {c.badge}
          </span>
          <h1 className="font-display text-[1.75rem] font-extrabold leading-tight text-blue-navy md:text-3xl">
            {c.title}
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">{c.subtitle}</p>
          <p className="mt-4 text-sm italic text-blue-navy">{c.quote}</p>
        </div>

        <div className="mx-auto mt-6 grid w-full max-w-3xl flex-1 items-start gap-6 overflow-visible md:grid-cols-2">
          {CREATORS.map((creator) => (
            <div key={creator.name} className="relative z-0 overflow-visible hover:z-10">
              <CreatorCard
                creator={creator}
                description={c.bios[creator.name as keyof typeof c.bios]}
                className="max-h-[min(400px,50vh)]"
              />
            </div>
          ))}
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-3xl items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/60 px-5 py-3.5 shadow-[0_8px_28px_rgba(132,175,251,0.14)] backdrop-blur-xl">
          <p className="hidden text-sm text-text-secondary sm:block">{c.contactPrompt}</p>
          <a
            href="mailto:contact@lexasafe.fr"
            className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-blue-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(2,89,221,0.28)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {c.contactCta}
          </a>
        </div>
      </main>
    </div>
  );
}
