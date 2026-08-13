"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { AmbientBackground, GlassCard } from "@lexasafe/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <>
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="rounded-pill border border-white/30 bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl">
          <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-blue-navy">
            <ArrowLeft className="h-4 w-4" />
            Retour connexion
          </Link>
        </div>
      </header>
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-24">
        <GlassCard padding="lg" className="w-full max-w-md bg-white/95">
          <div className="mb-6 text-center">
            <Mail className="mx-auto mb-3 h-10 w-10 text-blue-primary" />
            <h1 className="font-display text-2xl font-bold text-blue-navy">Réinitialisation</h1>
            <p className="mt-2 text-sm text-text-secondary">Lien à usage unique, expiration 15 minutes.</p>
          </div>
          {sent ? (
            <p className="rounded-xl border border-emerald-border bg-emerald-bg p-4 text-sm text-emerald-text">
              Si un compte existe, un email de réinitialisation a été envoyé via SMTP souverain OVH.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.fr" maxLength={255}
                className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none" />
              <button type="submit" disabled={loading}
                className="w-full rounded-pill bg-blue-primary py-3 font-semibold text-white disabled:opacity-60">
                {loading ? "Envoi..." : "Envoyer le lien sécurisé"}
              </button>
            </form>
          )}
        </GlassCard>
      </main>
    </>
  );
}
