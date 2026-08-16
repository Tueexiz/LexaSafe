import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@lexasafe/motion";
import { CREATORS } from "@/content/creators";
import { CreatorCard } from "@/components/CreatorCard";
import { getMessages } from "@/i18n/server";

export async function CreatorsSection() {
  const { t } = await getMessages();
  const c = t.creators;

  return (
    <section
      className="border-t border-border-subtle bg-gradient-to-b from-white via-[#FBF8F4] to-[#F5F9FF] py-24"
      id="creators"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              {c.badge}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-5xl">{c.title}</h2>
            <p className="mt-4 text-lg text-text-secondary">{c.subtitle}</p>
            <p className="mt-8 text-lg italic text-blue-navy">{c.quote}</p>
          </div>
        </FadeUp>

        <div className="mx-auto grid max-w-3xl items-stretch gap-6 overflow-visible sm:grid-cols-2">
          {CREATORS.map((creator) => (
            <FadeUp key={creator.name} className="relative z-0 overflow-visible hover:z-10">
              <CreatorCard
                creator={creator}
                description={c.bios[creator.name as keyof typeof c.bios]}
              />
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <div className="mt-14 flex justify-center">
            <Link
              href="/createurs"
              className="group inline-flex items-center gap-2 rounded-pill bg-blue-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_6px_24px_rgba(2,89,221,0.28)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {c.discover}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
