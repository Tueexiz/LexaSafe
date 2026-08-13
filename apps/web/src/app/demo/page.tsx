"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { AmbientBackground, GlassCard } from "@lexasafe/ui";
import { FadeUp } from "@lexasafe/motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function DemoPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${API_URL}/api/demo/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "demo-form",
        },
        body: JSON.stringify({
          company_name: form.get("company_name"),
          siren: form.get("siren"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Impossible d'envoyer la demande. Réessayez ou contactez contact@lexasafe.fr");
    }
  }

  return (
    <>
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="rounded-pill border border-white/30 bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-blue-navy">
            <ArrowLeft className="h-4 w-4" />
            Retour Accueil
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-xl px-6 pb-20 pt-32">
        <FadeUp>
          <GlassCard padding="lg" className="bg-white/90">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-blue-tint text-blue-primary">
                <Send className="h-7 w-7" />
              </div>
              <h1 className="font-display text-2xl font-bold text-blue-navy">Demander une Démo</h1>
              <p className="mt-2 text-sm text-text-secondary">
                Accès souverain LexaSafe pour votre entreprise. Validation téléphone certifié requise.
              </p>
            </div>
            {status === "success" ? (
              <div className="rounded-xl border border-emerald-border bg-emerald-bg p-6 text-center text-emerald-text">
                <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-emerald-valid" />
                <p className="font-semibold">Demande enregistrée avec succès.</p>
                <p className="mt-2 text-sm">Notre équipe vous contactera sous 24h ouvrées.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="company_name" className="mb-1 block text-sm font-semibold">Entreprise</label>
                  <input id="company_name" name="company_name" required maxLength={255}
                    className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="siren" className="mb-1 block text-sm font-semibold">SIREN (9 chiffres)</label>
                  <input id="siren" name="siren" required pattern="[0-9]{9}" maxLength={9}
                    className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email DPO / Juridique</label>
                  <input id="email" name="email" type="email" required maxLength={255}
                    className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-semibold">Téléphone (+33, mobile certifié)</label>
                  <input id="phone" name="phone" required pattern="(\+33|0)[67][0-9]{8}" placeholder="+33612345678" maxLength={20}
                    className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-semibold">Message (optionnel)</label>
                  <textarea id="message" name="message" rows={3} maxLength={2000}
                    className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none" />
                </div>
                {error && <p className="text-sm text-crimson-threat">{error}</p>}
                <button type="submit" disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-pill bg-crimson-threat py-3.5 font-bold text-white hover:bg-crimson-hover disabled:opacity-60">
                  {status === "loading" ? "Envoi..." : "Faire une demande"}
                </button>
              </form>
            )}
          </GlassCard>
        </FadeUp>
      </main>
    </>
  );
}
