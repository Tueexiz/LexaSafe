import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-white py-12">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="font-display text-lg font-bold text-blue-navy">LexaSafe France</div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
            <Link href="/demo">Demande d&apos;accès</Link>
            <Link href="/createurs">Équipe</Link>
            <a href="#faq">FAQ</a>
            <a href="mailto:contact@lexasafe.fr">contact@lexasafe.fr</a>
          </nav>
          <p className="text-xs text-text-muted">© 2026 LexaSafe — 100% Souverain</p>
        </div>
      </div>
    </footer>
  );
}
