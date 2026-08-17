"use client";

import { useEffect, useMemo, useState } from "react";
import { FilePlus2, Hash, Scale, Timer } from "lucide-react";
import { AnimatePresence, motion } from "@lexasafe/motion";
import { CountUp } from "@/components/CountUp";
import { DashCard } from "@/components/DashCard";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusPill } from "@/components/StatusPill";
import { formatDeadline, formatHash, statusTone } from "@/lib/status";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Requisition {
  public_hash: string;
  status: string;
  legal_basis: string;
  urgency_deadline: string;
  created_at: string;
}

type FilterId = "all" | "active" | "sealed" | "risk";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "active", label: "En cours" },
  { id: "sealed", label: "Scellées" },
  { id: "risk", label: "À risque" },
];

function matchesFilter(item: Requisition, filter: FilterId) {
  if (filter === "all") return true;
  const tone = statusTone(item.status);
  if (filter === "risk") return tone === "danger" || tone === "warn";
  if (filter === "sealed") return tone === "ok";
  return tone === "muted" || tone === "warn";
}

export default function DashboardPage() {
  const [items, setItems] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    fetch(`${API_URL}/api/requisitions`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => items.filter((item) => matchesFilter(item, filter)), [items, filter]);
  const riskCount = items.filter((item) => {
    const tone = statusTone(item.status);
    return tone === "danger" || tone === "warn";
  }).length;
  const sealedCount = items.filter((item) => statusTone(item.status) === "ok").length;

  return (
    <DashboardShell
      kicker="Canal OPJ · Zéro IDOR"
      title="Réquisitions judiciaires"
      subtitle="Canaux sécurisés — références public_hash uniquement. Aucun identifiant interne n’est exposé dans l’interface."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <DashCard>
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Actives</p>
          <p className="mt-2 font-syne text-4xl font-extrabold text-blue-navy">
            <CountUp value={items.length} />
          </p>
          <p className="mt-1 text-sm text-text-secondary">Réquisitions chargées</p>
        </DashCard>
        <DashCard>
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Scellées</p>
          <p className="mt-2 font-syne text-4xl font-extrabold text-blue-primary">
            <CountUp value={sealedCount} />
          </p>
          <p className="mt-1 text-sm text-text-secondary">Chaîne de custody prête</p>
        </DashCard>
        <DashCard>
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">À surveiller</p>
          <p className="mt-2 font-syne text-4xl font-extrabold text-crimson-threat">
            <CountUp value={riskCount} />
          </p>
          <p className="mt-1 text-sm text-text-secondary">Délais ou statuts sensibles</p>
        </DashCard>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="ios-glass relative inline-flex rounded-full p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === item.id ? "text-blue-navy" : "text-text-muted hover:text-blue-navy"
              }`}
            >
              {filter === item.id ? (
                <motion.span
                  layoutId="req-filter"
                  className="absolute inset-0 rounded-full bg-white shadow-[0_6px_16px_rgba(10,37,64,0.08)]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              ) : null}
              <span className="relative z-[1]">{item.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold text-text-muted">{visible.length} dossier{visible.length > 1 ? "s" : ""}</p>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <DashCard>
            <p className="text-text-muted">Chargement des canaux sécurisés…</p>
          </DashCard>
        ) : visible.length === 0 ? (
          <DashCard padding="lg" className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-blue-tint text-blue-primary">
              <FilePlus2 className="h-7 w-7" />
            </div>
            <h2 className="font-syne text-xl font-bold text-blue-navy">Aucune réquisition active</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
              Les dossiers apparaissent ici dès qu’un canal est ouvert. Les références restent des public_hash — jamais
              d’identifiant interne.
            </p>
          </DashCard>
        ) : (
          <AnimatePresence initial={false}>
            {visible.map((item) => (
              <motion.div
                key={item.public_hash}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
              >
                <DashCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
                      <Hash className="h-3.5 w-3.5 text-blue-primary" />
                      {formatHash(item.public_hash)}
                    </div>
                    <div className="mt-2 flex items-center gap-2 font-syne text-lg font-bold text-blue-navy">
                      <Scale className="h-4 w-4 text-blue-primary" />
                      {item.legal_basis || "Base légale non renseignée"}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {item.urgency_deadline ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                        <Timer className="h-3.5 w-3.5 text-crimson-threat" />
                        {formatDeadline(item.urgency_deadline)}
                      </span>
                    ) : null}
                    <StatusPill status={item.status} />
                  </div>
                </DashCard>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </DashboardShell>
  );
}
