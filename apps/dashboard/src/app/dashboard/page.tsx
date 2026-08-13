"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Shield, LogOut, LayoutDashboard } from "lucide-react";
import { GlassCard } from "@lexasafe/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Requisition {
  public_hash: string;
  status: string;
  legal_basis: string;
  urgency_deadline: string;
  created_at: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/requisitions`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg-subtle">
      <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-border-subtle bg-white/80 p-6 backdrop-blur-xl">
        <div className="font-display text-xl font-bold text-blue-navy">LexaSafe</div>
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 rounded-xl bg-bg-blue-tint px-4 py-2.5 text-sm font-semibold text-blue-primary">
            <LayoutDashboard className="h-4 w-4" /> Réquisitions
          </Link>
          <Link href="/entreprise" className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-subtle">
            <FileText className="h-4 w-4" /> Espace Entreprise
          </Link>
          <Link href="/admin/checklist" className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-subtle">
            <Shield className="h-4 w-4" /> Checklist QA
          </Link>
        </nav>
        <a href={`${process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001"}/login`}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-crimson-threat">
          <LogOut className="h-4 w-4" /> Déconnexion
        </a>
      </aside>
      <main className="ml-64 p-8">
        <h1 className="font-display text-3xl font-bold text-blue-navy">Réquisitions Judiciaires</h1>
        <p className="mt-2 text-text-secondary">Canaux sécurisés — références public_hash uniquement (Zéro IDOR)</p>
        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-text-muted">Chargement...</p>
          ) : items.length === 0 ? (
            <GlassCard><p className="text-text-secondary">Aucune réquisition active.</p></GlassCard>
          ) : (
            items.map((r) => (
              <GlassCard key={r.public_hash} className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-text-muted">{r.public_hash.slice(0, 16)}...</div>
                  <div className="mt-1 font-semibold text-blue-navy">{r.legal_basis}</div>
                </div>
                <span className="rounded-pill bg-emerald-bg px-3 py-1 text-xs font-bold text-emerald-valid">{r.status}</span>
              </GlassCard>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
