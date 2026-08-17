import { Mail } from "lucide-react";
import { CREATORS } from "@/content/creators";
import { CreatorCard } from "@/components/CreatorCard";
import { CreatorsMotion } from "@/components/CreatorsMotion";
import { getMessages } from "@/i18n/server";

export async function CreatorsSection() {
  const { t } = await getMessages();
  const c = t.creators;

  return (
    <section
      className="border-t border-border-subtle bg-gradient-to-b from-white via-[#FBF8F4] to-[#F5F9FF] py-24"
      id="creators"
    >
      <CreatorsMotion>
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              {c.badge}
            </span>
            <h2 className="creators-copy font-display text-3xl font-extrabold text-blue-navy md:text-5xl">{c.title}</h2>
            <p className="creators-copy mt-4 text-lg text-text-secondary">{c.subtitle}</p>
            <p className="creators-copy mt-8 text-lg italic text-blue-navy">{c.quote}</p>
          </div>

          <div className="mx-auto grid max-w-3xl items-stretch gap-6 overflow-visible sm:grid-cols-2">
            {CREATORS.map((creator) => (
              <div key={creator.name} className="creator-card-enter relative z-0 overflow-visible hover:z-10">
                <CreatorCard
                  creator={creator}
                  description={c.bios[creator.name as keyof typeof c.bios]}
                />
              </div>
            ))}
          </div>

          <div className="creators-contact mx-auto mt-10 flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/35 px-5 py-3.5 shadow-[0_8px_28px_rgba(132,175,251,0.16)] backdrop-blur-2xl backdrop-saturate-150">
            <p className="hidden text-sm text-text-secondary sm:block">{c.contactPrompt}</p>
            <a
              href="mailto:contact@lexasafe.fr"
              className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-blue-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(2,89,221,0.28)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {c.contactCta}
            </a>
          </div>
        </div>
      </CreatorsMotion>
    </section>
  );
}
