import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "./SiteFooter";
import { WebHeader } from "./WebHeader";

export function LegalPageLayout({
  badge,
  title,
  subtitle,
  children,
}: {
  badge: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <WebHeader />
      <main className="relative z-10 bg-gradient-to-b from-white via-[#FBF8F4] to-[#F5F9FF] pb-24 pt-32">
        <div className="container mx-auto max-w-3xl px-6">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>

          <div className="mb-10">
            <span className="mb-4 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              {badge}
            </span>
            <h1 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">{title}</h1>
            <p className="mt-3 text-lg text-text-secondary">{subtitle}</p>
          </div>

          <article className="prose-legal rounded-2xl border border-white/70 bg-white/90 p-8 shadow-[0_12px_40px_rgba(132,175,251,0.1)] backdrop-blur-sm md:p-10">
            {children}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
