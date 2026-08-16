"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { motion } from "@lexasafe/motion";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

type NavId = "home" | "simulator" | "team";

function navClass(highlighted: boolean) {
  return `relative z-[1] rounded-full px-5 py-2 font-syne text-sm font-semibold transition-colors ${
    highlighted ? "text-blue-navy" : "text-blue-navy/70 hover:text-blue-navy"
  }`;
}

function sectionInView(): NavId {
  const marker = 140;
  const checks: { id: NavId; el: string }[] = [
    { id: "home", el: "hero" },
    { id: "simulator", el: "calculator" },
    { id: "team", el: "creators" },
  ];
  let current: NavId = "home";
  for (const item of checks) {
    const node = document.getElementById(item.el);
    if (!node) continue;
    if (node.getBoundingClientRect().top <= marker) current = item.id;
  }
  return current;
}

export function WebHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<NavId | null>(
    pathname.startsWith("/createurs") ? "team" : pathname === "/" ? "home" : null
  );
  const [hover, setHover] = useState<NavId | null>(null);
  const highlighted = hover ?? active;

  useEffect(() => {
    if (pathname.startsWith("/createurs")) {
      setActive("team");
      return;
    }
    if (pathname !== "/") {
      setActive(null);
      return;
    }

    const update = () => setActive(sectionInView());
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("hashchange", update);
    };
  }, [pathname]);

  const links: { id: NavId; href: string; label: string }[] = [
    { id: "home", href: "/", label: t.nav.home },
    { id: "simulator", href: "/#calculator", label: t.nav.simulator },
    { id: "team", href: "/createurs", label: t.nav.team },
  ];

  return (
    <>
      <header className="pointer-events-none fixed left-0 right-0 top-4 z-[1000] px-4 md:px-8">
        <div className="pointer-events-auto relative mx-auto flex max-w-[1440px] items-center justify-between">
          <div className="relative z-10 shrink-0">
            <BrandMark className="ios-glass relative rounded-full px-3 py-1.5" />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <nav
              className="ios-glass pointer-events-auto relative flex items-center gap-0.5 rounded-full px-1.5 py-1.5"
              aria-label="Navigation principale"
              onMouseLeave={() => setHover(null)}
            >
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={active === link.id ? "page" : undefined}
                  onClick={() => setActive(link.id)}
                  onMouseEnter={() => setHover(link.id)}
                  className={navClass(highlighted === link.id)}
                >
                  {highlighted === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_1px_0_rgba(255,255,255,0.9),0_6px_16px_rgba(10,37,64,0.08)]"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-[1]">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="relative z-10 hidden items-center gap-2.5 md:flex">
            <LanguageSwitcher align="right" />
            <a
              href={`${AUTH_URL}/login`}
              className="hero-shine-btn inline-flex items-center rounded-pill bg-blue-primary px-5 py-2.5 font-syne text-sm font-semibold text-white shadow-[0_4px_24px_rgba(2,89,221,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-hover hover:shadow-[0_8px_28px_rgba(2,89,221,0.4)]"
            >
              {t.nav.login}
            </a>
          </div>

          <button
            type="button"
            className="ios-glass relative z-10 rounded-full p-2.5 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={t.nav.openMenu}
          >
            <Menu className="relative z-[1] h-5 w-5 text-blue-navy" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-blue-navy p-6 text-white md:hidden">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BrandMark inverted />
              <LanguageSwitcher inverted />
            </div>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label={t.nav.closeMenu}>
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-2 font-syne text-2xl font-bold">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => {
                  setActive(link.id);
                  setMobileOpen(false);
                }}
                className="py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={`${AUTH_URL}/login`}
            className="hero-shine-btn rounded-pill bg-blue-primary py-4 text-center font-semibold text-white shadow-[0_4px_24px_rgba(2,89,221,0.35)]"
          >
            {t.nav.login}
          </a>
        </div>
      )}
    </>
  );
}
