"use client";

import { useState } from "react";
import { Building2, CreditCard, FileLock2, Shield } from "lucide-react";
import { AnimatePresence, motion } from "@lexasafe/motion";
import { DashCard } from "@/components/DashCard";
import { DashboardShell } from "@/components/DashboardShell";

const TABS = [
  {
    id: "organisation",
    label: "Organisation",
    icon: Building2,
    title: "SIREN, whitelist et contacts",
    body: "Gestion SIREN, whitelist IP et contacts DPO. Les identifiants internes restent côté serveur.",
  },
  {
    id: "abonnement",
    label: "Abonnement",
    icon: CreditCard,
    title: "Facturation annuelle lissée",
    body: "Facturation annuelle lissée mensuellement. Le renouvellement est auto-notifié (J-30 / J-7 / J-1).",
  },
  {
    id: "conformite",
    label: "Conformité",
    icon: Shield,
    title: "RGPD et crypto-shred",
    body: "Export d’audit, droit à l’effacement définitif (crypto-shred) et journal d’accès souverain.",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EntreprisePage() {
  const [tab, setTab] = useState<TabId>("organisation");
  const current = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <DashboardShell
      kicker="Espace entreprise & DPO"
      title="Pilotage de l’entité"
      subtitle="Organisation, abonnement et conformité — la même surface visuelle que le canal OPJ, sans exposer le SI."
    >
      <div className="ios-glass relative mb-6 inline-flex rounded-full p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold ${
              tab === item.id ? "text-blue-navy" : "text-text-muted hover:text-blue-navy"
            }`}
          >
            {tab === item.id ? (
              <motion.span
                layoutId="ent-tab"
                className="absolute inset-0 rounded-full bg-white shadow-[0_6px_16px_rgba(10,37,64,0.08)]"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative z-[1] inline-flex items-center gap-2">
              <item.icon className="h-3.5 w-3.5 text-blue-primary" />
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <DashCard padding="lg" className="max-w-3xl">
            <current.icon className="mb-4 h-8 w-8 text-blue-primary" />
            <h2 className="font-syne text-2xl font-bold text-blue-navy">{current.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">{current.body}</p>
          </DashCard>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {TABS.map((item) => (
          <DashCard key={item.id}>
            <item.icon className="mb-3 h-7 w-7 text-blue-primary" />
            <h3 className="font-syne font-bold text-blue-navy">{item.label}</h3>
            <p className="mt-2 text-sm text-text-secondary">{item.body}</p>
          </DashCard>
        ))}
      </div>

      <DashCard className="mt-6 flex items-start gap-3" padding="md">
        <FileLock2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-primary" />
        <p className="text-sm text-text-secondary">
          Les réquisitions inbound s’affichent dans le canal OPJ. Cet espace ne duplique pas les dossiers : il pilote
          l’entité, l’abonnement et la conformité.
        </p>
      </DashCard>
    </DashboardShell>
  );
}
