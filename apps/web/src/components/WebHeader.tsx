"use client";

import Link from "next/link";
import { Calculator, Lock, Menu, X } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@lexasafe/ui";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";

export function WebHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <SiteHeader>
        <Link href="/" className="font-display text-lg font-extrabold text-blue-navy">
          LexaSafe
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          <a href="#calculator" className="text-sm font-medium text-text-secondary hover:text-blue-primary">
            Simulateur
          </a>
          <a href="#tarifs" className="text-sm font-medium text-text-secondary hover:text-blue-primary">
            Tarifs
          </a>
          <a href="#creators" className="text-sm font-medium text-text-secondary hover:text-blue-primary">
            L&apos;Équipe
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={`${AUTH_URL}/login`}
            className="hidden items-center gap-2 rounded-lg border border-blue-primary bg-blue-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-hover md:inline-flex"
          >
            <Lock className="h-4 w-4" />
            <span>Connexion</span>
          </a>
          <button
            type="button"
            className="rounded-lg p-2 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </SiteHeader>

      {mobileOpen && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-blue-navy p-6 text-white">
          <div className="mb-8 flex items-center justify-between">
            <span className="font-display text-xl font-bold">LexaSafe</span>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Fermer">
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-4 text-2xl font-display font-bold">
            <a href="#workflow" onClick={() => setMobileOpen(false)}>Plateforme</a>
            <a href="#avantages" onClick={() => setMobileOpen(false)}>Sécurité</a>
            <a href="#dangers" onClick={() => setMobileOpen(false)}>Risques Évités</a>
            <a href="#calculator" onClick={() => setMobileOpen(false)}>Simulateur</a>
            <a href="#tarifs" onClick={() => setMobileOpen(false)}>Tarifs</a>
          </nav>
          <div className="flex flex-col gap-3">
            <a
              href={`${AUTH_URL}/login`}
              className="flex items-center justify-center gap-2 rounded-lg bg-white py-4 font-semibold text-blue-navy"
            >
              <Lock className="h-4 w-4" />
              Connexion Portail
            </a>
            <Link href="/demo" className="rounded-lg border border-white/30 py-3 text-center">
              Demander une démo
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
