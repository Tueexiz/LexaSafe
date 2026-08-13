"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Shield } from "lucide-react";
import { GlassCard } from "@lexasafe/ui";
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
    <div className="min-h-screen bg-bg-subtle p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="text-sm text-blue-primary hover:underline">← Dashboard</Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-blue-navy">Checklist de Validation</h1>
            <p className="text-text-secondary">{validated}/{total} items validés et testés ({pct}%)</p>
          </div>
          <button onClick={exportJson} className="flex items-center gap-2 rounded-pill border border-border-medium bg-white px-4 py-2 text-sm font-semibold">
            <Download className="h-4 w-4" /> Export JSON
          </button>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-pill bg-border-subtle">
          <div className="h-full bg-emerald-valid transition-all" style={{ width: `${pct}%` }} />
        </div>
        {phases.map((phase) => (
          <section key={phase} className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-blue-navy">
              <Shield className="h-5 w-5 text-blue-primary" />
              {phase}
            </h2>
            <div className="space-y-2">
              {items.filter((i) => i.phase === phase).map((item) => (
                <GlassCard key={item.id} className="flex items-center justify-between gap-4 !p-4">
                  <span className="text-sm text-text-main">{item.label}</span>
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value as ChecklistStatus)}
                    className="rounded-lg border border-border-medium px-3 py-1.5 text-xs font-semibold"
                  >
                    <option value="pending">En attente</option>
                    <option value="validated">Validé</option>
                    <option value="tested">Validé et Testé</option>
                  </select>
                </GlassCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
