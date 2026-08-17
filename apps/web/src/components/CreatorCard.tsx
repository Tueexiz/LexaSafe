import { Linkedin, Globe } from "lucide-react";
import type { Creator } from "@/content/creators";

export type { Creator };

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/40 text-blue-navy shadow-[0_4px_14px_rgba(2,89,221,0.12)] backdrop-blur-md backdrop-saturate-150 transition-colors hover:bg-white hover:text-blue-primary"
    >
      {children}
    </a>
  );
}

export function CreatorCard({
  creator,
  description,
  className = "max-h-[420px]",
}: {
  creator: Creator;
  description?: string;
  index?: number;
  className?: string;
}) {
  return (
    <article
      className={`relative isolate z-0 flex aspect-[4/5] w-full origin-center flex-col overflow-hidden rounded-[1.75rem] border border-white/70 p-5 shadow-[0_18px_40px_-12px_rgba(2,89,221,0.22),0_6px_18px_rgba(132,175,251,0.16)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:scale-[1.02] sm:p-6 ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(165deg, #84AFFB 0%, #C5D8FC 36%, #FFFFFF 74%, #FBF8F4 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-2xl backdrop-saturate-150"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 42%), radial-gradient(ellipse 70% 50% at 18% 0%, rgba(255,255,255,0.7) 0%, transparent 58%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[58%]">
        <h3 className="font-display text-2xl font-extrabold leading-none tracking-tight text-blue-navy md:text-[1.85rem]">
          {creator.name}
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">{description ?? creator.desc}</p>
        <div className="mt-3.5 flex items-center gap-2">
          <SocialLink href={creator.linkedin} label={`LinkedIn de ${creator.name}`}>
            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
          </SocialLink>
          <SocialLink href={creator.portfolio} label={`Portfolio de ${creator.name}`}>
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          </SocialLink>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-8 right-[-6%] z-[1] h-[70%] w-[70%]">
        <img
          src={`${creator.portrait}?v=2`}
          alt=""
          className="h-full w-full object-contain object-bottom drop-shadow-[0_18px_28px_rgba(10,37,64,0.22)]"
        />
      </div>
    </article>
  );
}
