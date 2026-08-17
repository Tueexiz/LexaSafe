"use client";

import { useEffect, useState } from "react";
import { Download, Shield } from "lucide-react";
import { motion } from "@lexasafe/motion";
import { CountUp } from "@/components/CountUp";
import { DashCard } from "@/components/DashCard";
import { DashboardShell } from "@/components/DashboardShell";
import { CHECKLIST_ITEMS, type ChecklistItem, type ChecklistStatus } from "@/lib/checklist";

const STORAGE_KEY = "lexasafe_qa_checklist";

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>(CHECKLIST_ITEMS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  function updateStatus(id: string, status: ChecklistStatus) {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lexasafe-checklist-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }

  const validated = items.filter((i) => i.status === "tested").length;
  const total = items.length;
  const pct = Math.round((validated / total) * 100);
  const phases = ["Phase 1 — Front-End & UX", "Phase 2 — Back-End", "Phase 3 — Cybersécurité", "Phase 4 — QA"];

  return (
    <DashboardShell
      kicker="Admin · QA"
      title="Checklist de validation"
      subtitle={`${validated}/${total} items validés et testés. La progression est locale (navigateur), sans backend fictif.`}
      actions={
        <button
          type="button"
          onClick={exportJson}
          className="hero-shine-btn inline-flex items-center gap-2 rounded-pill bg-blue-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(2,89,221,0.35)] hover:bg-blue-hover"
        >
          <Download className="h-4 w-4" /> Export JSON
        </button>
      }
    >
      <DashCard className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <p className="font-syne text-2xl font-bold text-blue-navy">
            <CountUp value={pct} />%
          </p>
          <p className="text-sm text-text-secondary">Couverture testée</p>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-pill bg-border-subtle">
          <motion.div
            className="h-full rounded-pill bg-blue-primary"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
        </div>
      </DashCard>

      {phases.map((phase) => (
        <section key={phase} className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 font-syne text-lg font-bold text-blue-navy">
            <Shield className="h-5 w-5 text-blue-primary" />
            {phase}
          </h2>
          <div className="space-y-2">
            {items
              .filter((i) => i.phase === phase)
              .map((item) => (
                <DashCard key={item.id} padding="sm" className="flex items-center justify-between gap-4">
                  <span className="text-sm text-text-main">{item.label}</span>
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value as ChecklistStatus)}
                    className="rounded-lg border border-border-medium bg-white/80 px-3 py-1.5 text-xs font-semibold"
                  >
                    <option value="pending">En attente</option>
                    <option value="validated">Validé</option>
                    <option value="tested">Validé et Testé</option>
                  </select>
                </DashCard>
              ))}
          </div>
        </section>
      ))}
    </DashboardShell>
  );
}
