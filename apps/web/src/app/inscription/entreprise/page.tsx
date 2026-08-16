"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Landmark, ShieldCheck } from "lucide-react";
import { AmbientBackground, GlassCard } from "@lexasafe/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Secteur = "prive" | "public";

type FormState = {
  entite: string;
  email: string;
  telephone: string;
  contact_nom: string;
  contact_fonction: string;
  besoin: string;
  website: string;
  // privé
  siren: string;
  forme_juridique: string;
  rcs: string;
  volume: string;
  // public
  type_organisme: string;
  rattachement: string;
  siret: string;
  referent_rgpd: string;
  acte_designation: string;
};

const initialForm: FormState = {
  entite: "",
  email: "",
  telephone: "",
  contact_nom: "",
  contact_fonction: "",
  besoin: "",
  website: "",
  siren: "",
  forme_juridique: "",
  rcs: "",
  volume: "",
  type_organisme: "",
  rattachement: "",
  siret: "",
  referent_rgpd: "",
  acte_designation: "",
};

const inputCls =
  "w-full rounded-lg border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none";
const labelCls = "mb-1 block text-sm font-semibold";

export default function InscriptionEntreprisePage() {
  const [secteur, setSecteur] = useState<Secteur>("prive");
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

    const commonPayload = {
      secteur,
      entite: form.entite,
      email: form.email,
      telephone: form.telephone,
      contact_nom: form.contact_nom,
      contact_fonction: form.contact_fonction,
      besoin: form.besoin,
      website: form.website,
    };
    const body =
      secteur === "prive"
        ? {
            ...commonPayload,
            siren: form.siren,
            forme_juridique: form.forme_juridique,
            rcs: form.rcs,
            volume: form.volume,
          }
        : {
            ...commonPayload,
            type_organisme: form.type_organisme,
            rattachement: form.rattachement,
            siret: form.siret,
            referent_rgpd: form.referent_rgpd,
            acte_designation: form.acte_designation,
          };

    try {
      const res = await fetch(`${API_URL}/api/registration/entreprise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Demande refusée");
      }
      setReference(data.reference ?? "ENT");
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

      <main className="relative z-10 mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 pb-12 pt-32">
        <GlassCard padding="lg" className="w-full bg-white/95">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-blue-tint text-blue-primary">
              <Building2 className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-blue-navy">Inscription Entreprise & Devis</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Devis souverain sur mesure. Sélectionnez votre secteur pour les informations requises.
            </p>
          </div>

          {reference ? (
            <div className="space-y-4 text-center">
              <div className="rounded-xl border border-blue-border bg-bg-blue-tint p-5">
                <ShieldCheck className="mx-auto mb-2 h-9 w-9 text-blue-primary" />
                <p className="font-semibold text-blue-navy">Demande de devis transmise.</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Référence : <span className="font-mono font-bold text-blue-primary">{reference}</span>
                </p>
              </div>
              <p className="text-sm text-text-secondary">
                Notre équipe revient vers vous sous 48h ouvrées après vérification de votre organisation.
              </p>
              <Link href="/" className="inline-block text-sm font-semibold text-blue-primary hover:underline">
                Retour à l&apos;accueil
              </Link>
            </div>
          ) : (
            <>
              {/* Toggle secteur */}
              <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-border-medium bg-white p-1">
                <button type="button" onClick={() => setSecteur("prive")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                    secteur === "prive" ? "bg-blue-primary text-white" : "text-blue-navy hover:bg-bg-blue-tint"
                  }`}>
                  <Building2 className="h-4 w-4" />
                  Secteur privé
                </button>
                <button type="button" onClick={() => setSecteur("public")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                    secteur === "public" ? "bg-blue-primary text-white" : "text-blue-navy hover:bg-bg-blue-tint"
                  }`}>
                  <Landmark className="h-4 w-4" />
                  Secteur public
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
                <div>
                  <label htmlFor="entite" className={labelCls}>
                    {secteur === "prive" ? "Raison sociale" : "Nom de l'entité publique"}
                  </label>
                  <input id="entite" name="entite" type="text" required maxLength={255}
                    value={form.entite} onChange={(e) => updateField("entite", e.target.value)} className={inputCls} />
                </div>

                {secteur === "prive" ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="siren" className={labelCls}>SIREN / SIRET</label>
                        <input id="siren" name="siren" type="text" required inputMode="numeric"
                          placeholder="9 ou 14 chiffres" maxLength={20}
                          value={form.siren} onChange={(e) => updateField("siren", e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="forme_juridique" className={labelCls}>Forme juridique</label>
                        <input id="forme_juridique" name="forme_juridique" type="text" placeholder="SAS, SARL, SA..."
                          maxLength={100} value={form.forme_juridique}
                          onChange={(e) => updateField("forme_juridique", e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="rcs" className={labelCls}>
                        N° RCS / extrait Kbis <span className="font-normal text-text-muted">(optionnel)</span>
                      </label>
                      <input id="rcs" name="rcs" type="text" maxLength={100}
                        value={form.rcs} onChange={(e) => updateField("rcs", e.target.value)} className={inputCls} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="type_organisme" className={labelCls}>Type d&apos;organisme</label>
                        <select id="type_organisme" name="type_organisme" required value={form.type_organisme}
                          onChange={(e) => updateField("type_organisme", e.target.value)} className={inputCls}>
                          <option value="">Sélectionner…</option>
                          <option value="ministere">Ministère / administration centrale</option>
                          <option value="collectivite">Collectivité territoriale</option>
                          <option value="etablissement_public">Établissement public</option>
                          <option value="hopital">Établissement de santé / hôpital</option>
                          <option value="autre">Autre entité publique</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="siret" className={labelCls}>SIRET</label>
                        <input id="siret" name="siret" type="text" required inputMode="numeric"
                          placeholder="14 chiffres" maxLength={20}
                          value={form.siret} onChange={(e) => updateField("siret", e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="rattachement" className={labelCls}>Rattachement administratif</label>
                      <input id="rattachement" name="rattachement" type="text" required
                        placeholder="Direction, tutelle, autorité de rattachement..." maxLength={255}
                        value={form.rattachement} onChange={(e) => updateField("rattachement", e.target.value)} className={inputCls} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="referent_rgpd" className={labelCls}>Référent RGPD désigné</label>
                        <input id="referent_rgpd" name="referent_rgpd" type="text" required maxLength={150}
                          placeholder="Nom et fonction" value={form.referent_rgpd}
                          onChange={(e) => updateField("referent_rgpd", e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="acte_designation" className={labelCls}>Réf. / date de l&apos;acte de désignation</label>
                        <input id="acte_designation" name="acte_designation" type="text" required maxLength={255}
                          placeholder="Arrêté n°… du …" value={form.acte_designation}
                          onChange={(e) => updateField("acte_designation", e.target.value)} className={inputCls} />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className={labelCls}>
                    {secteur === "prive" ? "Email DPO / juridique" : "Email institutionnel"}
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email" maxLength={255}
                    placeholder={secteur === "prive" ? "dpo@entreprise.fr" : "contact@collectivite.gouv.fr"}
                    value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputCls} />
                  <p className="mt-1 text-xs text-text-muted">Adresse professionnelle (les emails grand public sont refusés).</p>
                </div>

                <div>
                  <label htmlFor="telephone" className={labelCls}>Téléphone professionnel</label>
                  <input id="telephone" name="telephone" type="tel" required autoComplete="tel"
                    placeholder="+33 1 23 45 67 89" maxLength={20}
                    value={form.telephone} onChange={(e) => updateField("telephone", e.target.value)} className={inputCls} />
                  <p className="mt-1 text-xs text-text-muted">Ligne certifiée française (numéros VoIP refusés).</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact_nom" className={labelCls}>Responsable / contact</label>
                    <input id="contact_nom" name="contact_nom" type="text" required maxLength={150}
                      value={form.contact_nom} onChange={(e) => updateField("contact_nom", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="contact_fonction" className={labelCls}>Fonction</label>
                    <input id="contact_fonction" name="contact_fonction" type="text" required maxLength={150}
                      value={form.contact_fonction} onChange={(e) => updateField("contact_fonction", e.target.value)} className={inputCls} />
                  </div>
                </div>

                {secteur === "prive" && (
                  <div>
                    <label htmlFor="volume" className={labelCls}>
                      Volume estimé de réquisitions <span className="font-normal text-text-muted">(pour le devis)</span>
                    </label>
                    <input id="volume" name="volume" type="text" maxLength={100}
                      placeholder="Ex. 200 / an" value={form.volume}
                      onChange={(e) => updateField("volume", e.target.value)} className={inputCls} />
                  </div>
                )}

                <div>
                  <label htmlFor="besoin" className={labelCls}>
                    Votre besoin <span className="font-normal text-text-muted">(optionnel)</span>
                  </label>
                  <textarea id="besoin" name="besoin" rows={3} maxLength={2000}
                    value={form.besoin} onChange={(e) => updateField("besoin", e.target.value)} className={inputCls} />
                </div>

                <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Site web</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={(e) => updateField("website", e.target.value)} />
                </div>

                {error && <p className="text-sm text-crimson-threat">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full rounded-lg bg-blue-primary py-3 font-semibold text-white hover:bg-blue-hover disabled:opacity-60">
                  {loading ? "Transmission sécurisée..." : "Demander mon devis"}
                </button>

                <p className="text-center text-xs text-text-muted">
                  Votre demande est vérifiée (SIREN/SIRET, email professionnel) puis validée par un administrateur LexaSafe.
                </p>
              </form>
            </>
          )}
        </GlassCard>
      </main>
    </>
  );
}
