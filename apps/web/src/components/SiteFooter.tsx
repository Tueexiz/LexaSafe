import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU & SLA" },
  { href: "/politique-confidentialite", label: "Confidentialité (RGPD)" },
  { href: "/cookies", label: "Politique cookies" },
] as const;

const PRODUCT_LINKS = [
  { href: "/acces", label: "Créer un compte / Devis" },
  { href: "/#calculator", label: "Simulateur" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/createurs", label: "Équipe" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-white">
      <div className="container mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="font-display text-xl font-bold text-blue-navy">LexaSafe France</div>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Passerelle souveraine de réquisitions judiciaires. Hébergée en France chez OVHcloud SecNumCloud
              (ANSSI).
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Produit</h2>
            <nav className="mt-4 flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary transition-colors hover:text-blue-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Informations légales</h2>
            <nav className="mt-4 flex flex-col gap-2.5">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary transition-colors hover:text-blue-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Contact</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-text-secondary">
              <li>
                <a href="mailto:contact@lexasafe.fr" className="hover:text-blue-primary">
                  contact@lexasafe.fr
                </a>
              </li>
              <li>
                <a href="mailto:dpo@lexasafe.fr" className="hover:text-blue-primary">
                  dpo@lexasafe.fr
                </a>
                <span className="mt-0.5 block text-xs text-text-muted">Délégué à la Protection des Données</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-center md:flex-row md:text-left">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} LexaSafe France — Tous droits réservés · 100% Souverain · Zéro
            Connaissance
          </p>
          <p className="text-xs text-text-muted">
            Conforme LCEN · RGPD · e-Evidence · Hébergement OVHcloud SAS, Roubaix (FR)
          </p>
        </div>
      </div>
    </footer>
  );
}
