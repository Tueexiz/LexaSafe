import Link from "next/link";
import { ArrowLeft, ShieldX, Home, Send } from "lucide-react";
import { AmbientBackground } from "@lexasafe/ui";

export default function NotFound() {
  return (
    <>
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="rounded-pill border border-white/30 bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-blue-navy">
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </header>
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-crimson-border bg-crimson-bg text-crimson-threat">
          <ShieldX className="h-10 w-10" />
        </div>
        <div className="font-display text-7xl font-extrabold text-crimson-threat">404</div>
        <h1 className="mt-4 font-display text-2xl font-bold text-blue-navy md:text-4xl">
          Ressource Non Autorisée ou Page Introuvable
        </h1>
        <p className="mt-4 max-w-lg text-text-secondary">
          La ressource demandée n&apos;existe pas ou nécessite une clé d&apos;accès cryptographique valide.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-pill bg-blue-primary px-6 py-3 font-semibold text-white">
            <Home className="h-4 w-4" />
            Portail Principal
          </Link>
          <Link href="/demo" className="inline-flex items-center gap-2 rounded-pill border border-border-medium bg-white px-6 py-3 font-semibold text-blue-navy">
            <Send className="h-4 w-4" />
            Faire une Demande
          </Link>
        </div>
      </main>
    </>
  );
}
