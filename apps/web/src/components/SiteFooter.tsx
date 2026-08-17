import Link from "next/link";
import { BrandLockup } from "@/components/BrandLogo";
import { getMessages } from "@/i18n/server";

export async function SiteFooter() {
  const { t } = await getMessages();
  const f = t.footer;

  const productLinks = [
    { href: "/acces", label: f.access },
    { href: "/#calculator", label: f.simulator },
    { href: "/#tarifs", label: f.pricing },
    { href: "/#creators", label: f.team },
    { href: "/#faq", label: f.faq },
  ];

  const legalLinks = [
    { href: "/mentions-legales", label: f.legal },
    { href: "/cgu", label: f.terms },
    { href: "/politique-confidentialite", label: f.privacy },
    { href: "/cookies", label: f.cookies },
  ];

  return (
    <footer className="border-t border-border-subtle bg-white">
      <div className="container mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <BrandLockup className="h-auto w-[168px] max-w-full" />
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{f.blurb}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">{t.common.product}</h2>
            <nav className="mt-4 flex flex-col gap-2.5">
              {productLinks.map((link) => (
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">{t.common.legal}</h2>
            <nav className="mt-4 flex flex-col gap-2.5">
              {legalLinks.map((link) => (
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">{t.common.contact}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-text-secondary">
              <li>
                <a href="mailto:contact@lexasafe.fr" className="hover:text-blue-primary">
                  contact@lexasafe.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-center md:flex-row md:text-left">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} LexaSafe France — {f.rights}
          </p>
          <p className="text-xs text-text-muted">{f.compliance}</p>
        </div>
      </div>
    </footer>
  );
}
