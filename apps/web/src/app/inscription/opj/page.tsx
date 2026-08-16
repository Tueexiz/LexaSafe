"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, ShieldCheck } from "lucide-react";
import { AmbientBackground, GlassCard } from "@lexasafe/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type FormState = {
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  unite: string;
  grade: string;
  telephone: string;
  reference_procedure: string;
  website: string;
};

const initialForm: FormState = {
  nom: "",
  prenom: "",
  email: "",
  matricule: "",
  unite: "",
  grade: "",
  telephone: "",
  reference_procedure: "",
  website: "",
};

const inputCls =
  "w-full rounded-lg border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none";

export default function InscriptionOpjPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/registration/opj`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Demande refusée");
      }
      setReference(data.reference ?? "OPJ");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="rounded-pill border border-white/30 bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl">
          <Link href="/acces" className="flex items-center gap-2 text-sm font-semibold text-blue-navy">
            <ArrowLeft className="h-4 w-4" />
            Retour au choix
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-12 pt-32">
        <GlassCard padding="lg" className="w-full max-w-lg bg-white/95">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-blue-tint text-blue-primary">
              <BadgeCheck className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-blue-navy">
              Compte Officier de Police Judiciaire
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Accès gratuit réservé aux OPJ. Vérification anti-usurpation et validation manuelle obligatoire.
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-blue-border bg-bg-blue-tint p-4 text-sm text-blue-primary">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Mesures anti faux-OPJ
            </div>
            <p className="text-text-secondary">
              Email professionnel <strong>@*.gouv.fr</strong> obligatoire, téléphone certifié (anti-VoIP),
              matricule + unité + grade, puis validation humaine avant toute activation.
            </p>
          </div>

          {reference ? (
            <div className="space-y-4 text-center">
              <div className="rounded-xl border border-blue-border bg-bg-blue-tint p-5">
                <ShieldCheck className="mx-auto mb-2 h-9 w-9 text-blue-primary" />
                <p className="font-semibold text-blue-navy">Demande transmise avec succès.</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Référence : <span className="font-mono font-bold text-blue-primary">{reference}</span>
                </p>
              </div>
              <p className="text-sm text-text-secondary">
                Validation manuelle sous 48h ouvrées. Vous serez notifié sur votre adresse @*.gouv.fr.
              </p>
              <Link href="/" className="inline-block text-sm font-semibold text-blue-primary hover:underline">
                Retour à l&apos;accueil
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nom" className="mb-1 block text-sm font-semibold">Nom</label>
                  <input id="nom" name="nom" type="text" required autoComplete="family-name" maxLength={100}
                    value={form.nom} onChange={(e) => updateField("nom", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="prenom" className="mb-1 block text-sm font-semibold">Prénom</label>
                  <input id="prenom" name="prenom" type="text" required autoComplete="given-name" maxLength={100}
                    value={form.prenom} onChange={(e) => updateField("prenom", e.target.value)} className={inputCls} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email professionnel</label>
                <input id="email" name="email" type="email" required autoComplete="email"
                  placeholder="prenom.nom@interieur.gouv.fr" maxLength={255}
                  value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputCls} />
                <p className="mt-1 text-xs text-text-muted">Domaine @*.gouv.fr requis</p>
              </div>

              <div>
                <label htmlFor="matricule" className="mb-1 block text-sm font-semibold">
                  Numéro de matricule / identifiant OPJ
                </label>
                <input id="matricule" name="matricule" type="text" required maxLength={50}
                  value={form.matricule} onChange={(e) => updateField("matricule", e.target.value)} className={inputCls} />
              </div>

              <div>
                <label htmlFor="unite" className="mb-1 block text-sm font-semibold">Unité / service</label>
                <input id="unite" name="unite" type="text" required placeholder="Commissariat, brigade, direction..."
                  maxLength={200} value={form.unite} onChange={(e) => updateField("unite", e.target.value)} className={inputCls} />
              </div>

              <div>
                <label htmlFor="grade" className="mb-1 block text-sm font-semibold">Grade</label>
                <input id="grade" name="grade" type="text" required maxLength={100}
                  value={form.grade} onChange={(e) => updateField("grade", e.target.value)} className={inputCls} />
              </div>

              <div>
                <label htmlFor="telephone" className="mb-1 block text-sm font-semibold">
                  Téléphone professionnel
                </label>
                <input id="telephone" name="telephone" type="tel" required autoComplete="tel"
                  placeholder="+33 6 12 34 56 78" maxLength={20}
                  value={form.telephone} onChange={(e) => updateField("telephone", e.target.value)} className={inputCls} />
                <p className="mt-1 text-xs text-text-muted">Mobile ou fixe français certifié (numéros VoIP refusés)</p>
              </div>

              <div>
                <label htmlFor="reference_procedure" className="mb-1 block text-sm font-semibold">
                  Référence procédure ou justification <span className="font-normal text-text-muted">(optionnel)</span>
                </label>
                <textarea id="reference_procedure" name="reference_procedure" rows={3} maxLength={500}
                  value={form.reference_procedure} onChange={(e) => updateField("reference_procedure", e.target.value)}
                  className={inputCls} />
              </div>

              <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Site web</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
                  value={form.website} onChange={(e) => updateField("website", e.target.value)} />
              </div>

              {error && <p className="text-sm text-crimson-threat">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-blue-primary py-3 font-semibold text-white hover:bg-blue-hover disabled:opacity-60">
                {loading ? "Transmission sécurisée..." : "Transmettre ma demande"}
              </button>

              <p className="text-center text-xs text-text-muted">
                Aucun compte n&apos;est créé automatiquement. Votre demande est examinée par un administrateur LexaSafe.
              </p>
            </form>
          )}
        </GlassCard>
      </main>
    </>
  );
}
