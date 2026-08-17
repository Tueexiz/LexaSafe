"use client";

import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, Building2, Check, Landmark, RefreshCw, ShieldCheck, X } from "lucide-react";
import { AnimatePresence, motion } from "@lexasafe/motion";
import { CountUp } from "@/components/CountUp";
import { DashCard } from "@/components/DashCard";
import { DashboardShell } from "@/components/DashboardShell";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type RegistrationRequest = {
  id: string;
  type: "opj" | "entreprise_prive" | "entreprise_public";
  status: string;
  created_at: string;
  payload: Record<string, string>;
};

const TYPE_META: Record<RegistrationRequest["type"], { label: string; icon: typeof Building2 }> = {
  opj: { label: "Officier (OPJ)", icon: BadgeCheck },
  entreprise_prive: { label: "Entreprise privée", icon: Building2 },
  entreprise_public: { label: "Secteur public", icon: Landmark },
};

const FIELD_LABELS: Record<string, string> = {
  nom: "Nom",
  prenom: "Prénom",
  email: "Email",
  matricule: "Matricule",
  unite: "Unité",
  grade: "Grade",
  telephone: "Téléphone",
  reference_procedure: "Réf. procédure",
  entite: "Entité",
  secteur: "Secteur",
  siren: "SIREN",
  siret: "SIRET",
  forme_juridique: "Forme juridique",
  rcs: "RCS / Kbis",
  volume: "Volume estimé",
  type_organisme: "Type d'organisme",
  rattachement: "Rattachement",
  referent_rgpd: "Référent RGPD",
  acte_designation: "Acte de désignation",
  contact_nom: "Contact",
  contact_fonction: "Fonction",
  besoin: "Besoin",
};

export default function AdminInscriptionsPage() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/registration/admin/pending`);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function review(id: string, action: "approve" | "reject") {
    setBusyId(id);
    try {
      const res = await fetch(`${API_URL}/api/registration/admin/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "" }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardShell
      kicker="Admin · Inscriptions"
      title="Demandes d’inscription"
      subtitle="Validation manuelle OPJ / entreprise. Les actions appellent l’API existante — aucun backend fictif."
      actions={
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-pill border border-white/70 bg-white/70 px-4 py-2.5 text-sm font-semibold text-blue-navy backdrop-blur-xl hover:border-blue-primary"
        >
          <RefreshCw className="h-4 w-4" /> Rafraîchir
        </button>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <DashCard>
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">En attente</p>
          <p className="mt-2 font-syne text-4xl font-extrabold text-blue-navy">
            <CountUp value={requests.length} />
          </p>
        </DashCard>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-crimson-border bg-crimson-bg p-4 text-sm text-crimson-threat">
          {error}
        </div>
      ) : null}

      {loading ? (
        <DashCard>
          <p className="text-text-muted">Chargement…</p>
        </DashCard>
      ) : requests.length === 0 ? (
        <DashCard padding="lg" className="text-center">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-blue-primary" />
          <p className="font-syne text-lg font-bold text-blue-navy">Aucune demande en attente.</p>
          <p className="mt-1 text-sm text-text-secondary">Toutes les inscriptions ont été traitées.</p>
        </DashCard>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {requests.map((req) => {
              const meta = TYPE_META[req.type];
              const MetaIcon = meta.icon;
              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <DashCard padding="lg">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-blue-tint text-blue-primary">
                          <MetaIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-syne text-lg font-bold text-blue-navy">
                            {req.payload.entite ||
                              `${req.payload.prenom ?? ""} ${req.payload.nom ?? ""}`.trim() ||
                              "Demande"}
                          </p>
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-accent">{meta.label}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => review(req.id, "approve")}
                          disabled={busyId === req.id}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-primary px-4 py-2 text-sm font-bold text-white hover:bg-blue-hover disabled:opacity-60"
                        >
                          <Check className="h-4 w-4" /> Approuver
                        </button>
                        <button
                          type="button"
                          onClick={() => review(req.id, "reject")}
                          disabled={busyId === req.id}
                          className="flex items-center gap-1.5 rounded-lg border border-crimson-border bg-white px-4 py-2 text-sm font-bold text-crimson-threat hover:bg-crimson-bg disabled:opacity-60"
                        >
                          <X className="h-4 w-4" /> Rejeter
                        </button>
                      </div>
                    </div>

                    <dl className="mt-5 grid gap-x-6 gap-y-2 border-t border-border-subtle pt-4 sm:grid-cols-2">
                      {Object.entries(req.payload)
                        .filter(([, value]) => value !== null && value !== "")
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between gap-3 text-sm">
                            <dt className="text-text-muted">{FIELD_LABELS[key] ?? key}</dt>
                            <dd className="text-right font-medium text-blue-navy">{String(value)}</dd>
                          </div>
                        ))}
                    </dl>
                    <p className="mt-3 text-xs text-text-muted">
                      Reçue le {new Date(req.created_at).toLocaleString("fr-FR")}
                    </p>
                  </DashCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </DashboardShell>
  );
}
