"use client";

import Link from "next/link";
import { Building2, CreditCard, Shield } from "lucide-react";
import { GlassCard } from "@lexasafe/ui";

export default function EntreprisePage() {
  return (
    <div className="min-h-screen bg-bg-subtle p-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="text-sm text-blue-primary hover:underline">← Retour dashboard</Link>
        <h1 className="mt-4 font-display text-3xl font-bold text-blue-navy">Espace Entreprise & DPO</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <GlassCard>
            <Building2 className="mb-3 h-8 w-8 text-blue-primary" />
            <h2 className="font-display font-bold text-blue-navy">Organisation</h2>
            <p className="mt-2 text-sm text-text-secondary">Gestion SIREN, whitelist IP et contacts DPO.</p>
          </GlassCard>
          <GlassCard>
            <CreditCard className="mb-3 h-8 w-8 text-emerald-valid" />
            <h2 className="font-display font-bold text-blue-navy">Abonnement</h2>
            <p className="mt-2 text-sm text-text-secondary">Facturation annuelle lissée mensuellement. Renouvellement auto-notifié.</p>
          </GlassCard>
          <GlassCard>
            <Shield className="mb-3 h-8 w-8 text-blue-primary" />
            <h2 className="font-display font-bold text-blue-navy">Conformité RGPD</h2>
            <p className="mt-2 text-sm text-text-secondary">Export audit, droit à l&apos;effacement définitif (crypto-shred).</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
