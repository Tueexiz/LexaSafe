"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Shield,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "@lexasafe/motion";

gsap.registerPlugin(useGSAP);

const SovereignFlowCanvas = dynamic(
  () => import("./SovereignFlowCanvas").then((m) => ({ default: m.SovereignFlowCanvas })),
  { ssr: false }
);

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

const NAV = [
  { href: "/dashboard", label: "Réquisitions", icon: LayoutDashboard },
  { href: "/entreprise", label: "Entreprise", icon: Building2 },
  { href: "/admin/checklist", label: "Checklist QA", icon: ClipboardCheck },
  { href: "/admin/inscriptions", label: "Inscriptions", icon: UserPlus },
] as const;

function navActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function DashboardShell({
  kicker,
  title,
  subtitle,
  actions,
  children,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".dash-aside", {
        x: -28,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".dash-nav-item", {
        x: -18,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.45,
        delay: 0.12,
        ease: "power2.out",
      });
      gsap.from(".dash-hero", {
        y: 22,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".dash-main-body", {
        y: 28,
        autoAlpha: 0,
        duration: 0.75,
        delay: 0.08,
        ease: "power3.out",
      });
    },
    { scope: rootRef, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-[#FBF8F4] text-text-main">
      <aside className="dash-aside ios-glass fixed bottom-0 left-0 top-0 z-30 hidden w-72 flex-col border-r border-white/50 p-6 md:flex">
        <div className="relative z-[1]">
          <p className="font-syne text-xl font-extrabold tracking-tight text-blue-navy">LexaSafe</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-primary">
            Espace opérationnel
          </p>
        </div>
        <nav className="relative z-[1] mt-10 flex flex-1 flex-col gap-1.5">
          {NAV.map((item) => {
            const active = navActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "text-blue-navy" : "text-text-secondary hover:text-blue-navy"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="dash-nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/80 shadow-[0_8px_24px_rgba(2,89,221,0.1)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <item.icon className="relative z-[1] h-4 w-4 text-blue-primary" />
                <span className="relative z-[1]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <a
          href={`${AUTH_URL}/login`}
          className="relative z-[1] mt-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-crimson-threat"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </a>
      </aside>

      <div className="md:ml-72">
        <header className="ios-glass sticky top-0 z-20 mx-4 mt-4 flex items-center justify-between rounded-full px-4 py-2.5 md:hidden">
          <span className="font-syne text-sm font-bold text-blue-navy">LexaSafe</span>
          <div className="flex gap-2 text-xs font-semibold text-blue-primary">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={navActive(pathname, item.href) ? "text-blue-navy" : ""}>
                {item.label.split(" ")[0]}
              </Link>
            ))}
          </div>
        </header>

        <section className="dash-hero relative overflow-hidden px-4 pb-4 pt-8 md:px-10 md:pt-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-80" aria-hidden="true">
            <SovereignFlowCanvas />
          </div>
          <div className="relative z-[1] flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-primary">
                <Shield className="h-3.5 w-3.5" />
                {kicker}
              </p>
              <h1 className="font-syne text-3xl font-extrabold tracking-tight text-blue-navy md:text-5xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm text-text-secondary md:text-base">{subtitle}</p>
            </div>
            {actions ? <div className="relative z-[1]">{actions}</div> : null}
          </div>
        </section>

        <main className="dash-main-body relative z-[1] px-4 pb-16 md:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
