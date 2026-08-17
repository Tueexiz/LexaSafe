"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clapperboard, Send, ShieldCheck } from "lucide-react";
import { FadeUp } from "@lexasafe/motion";
import { GlassCard } from "@lexasafe/ui";
import { useI18n } from "@/i18n/I18nProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const SCENES = [
  { titleKey: "sceneHero", bodyKey: "sceneHeroBody" },
  { titleKey: "sceneFlow", bodyKey: "sceneFlowBody" },
  { titleKey: "sceneOpj", bodyKey: "sceneOpjBody" },
  { titleKey: "sceneEnt", bodyKey: "sceneEntBody" },
] as const;

export function DemoExperience({
  hasVideo,
  seedanceReady,
}: {
  hasVideo: boolean;
  seedanceReady: boolean;
}) {
  const { t } = useI18n();
  const d = t.demo;
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [filmStatus, setFilmStatus] = useState<"idle" | "loading" | "error">("idle");
  const [filmError, setFilmError] = useState("");

  async function handleGenerateFilm() {
    setFilmStatus("loading");
    setFilmError("");
    try {
      const res = await fetch("/api/demo/seedance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string; savedPath?: string };
      if (!res.ok) throw new Error(payload.error || d.generateError);
      router.refresh();
      setFilmStatus("idle");
    } catch (err) {
      setFilmStatus("error");
      setFilmError(err instanceof Error ? err.message : d.generateError);
    }
  }

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
      if (!res.ok) throw new Error("send-failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError(d.error);
    }
  }

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-36">
      <FadeUp>
        <div className="mb-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
            <Clapperboard className="h-3.5 w-3.5" />
            Seedance
          </span>
          <h1 className="font-syne text-4xl font-extrabold text-blue-navy md:text-5xl">{d.filmTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">{d.filmLead}</p>
        </div>
      </FadeUp>

      <FadeUp index={1}>
        <GlassCard padding="lg" className="mb-10 overflow-hidden bg-white/90 p-0">
          {hasVideo ? (
            <video
              className="aspect-video w-full bg-blue-navy"
              controls
              playsInline
              preload="metadata"
              src="/demo/lexasafe-product.mp4"
            >
              {d.watch}
            </video>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center bg-gradient-to-br from-[#FBF8F4] via-white to-[#E8F0FE] px-6 text-center">
              <Clapperboard className="mb-4 h-10 w-10 text-blue-primary" />
              <p className="max-w-md text-sm text-text-secondary">{d.missingVideo}</p>
              <p className="mt-3 text-xs font-semibold text-blue-navy">
                {seedanceReady ? d.generateHint : d.generateMissing}
              </p>
              {seedanceReady ? (
                <button
                  type="button"
                  onClick={handleGenerateFilm}
                  disabled={filmStatus === "loading"}
                  className="hero-shine-btn mt-5 inline-flex items-center rounded-pill bg-blue-primary px-5 py-2.5 font-syne text-sm font-semibold text-white disabled:opacity-60"
                >
                  {filmStatus === "loading" ? d.generating : d.generateCta}
                </button>
              ) : (
                <a
                  href="/setup"
                  className="mt-5 inline-flex items-center rounded-pill border border-blue-border bg-white/70 px-5 py-2.5 font-syne text-sm font-semibold text-blue-navy"
                >
                  Configuration APIs
                </a>
              )}
              {filmError ? <p className="mt-3 text-xs text-crimson-threat">{filmError}</p> : null}
            </div>
          )}
        </GlassCard>
      </FadeUp>

      <FadeUp index={2}>
        <h2 className="mb-4 font-syne text-2xl font-bold text-blue-navy">{d.storyboardTitle}</h2>
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          {SCENES.map((scene, i) => (
            <GlassCard key={scene.titleKey}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-primary">0{i + 1}</p>
              <h3 className="mt-1 font-syne text-lg font-bold text-blue-navy">{d[scene.titleKey]}</h3>
              <p className="mt-2 text-sm text-text-secondary">{d[scene.bodyKey]}</p>
            </GlassCard>
          ))}
        </div>
      </FadeUp>

      <FadeUp index={3}>
        <GlassCard padding="lg" className="mx-auto max-w-xl bg-white/90">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-blue-tint text-blue-primary">
              <Send className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-blue-navy">{d.title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{d.lead}</p>
          </div>
          {status === "success" ? (
            <div className="rounded-xl border border-emerald-border bg-emerald-bg p-6 text-center text-emerald-text">
              <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-emerald-valid" />
              <p className="font-semibold">{d.success}</p>
              <p className="mt-2 text-sm">{d.successHint}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="company_name" className="mb-1 block text-sm font-semibold">
                  {d.company}
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  required
                  maxLength={255}
                  className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="siren" className="mb-1 block text-sm font-semibold">
                  {d.siren}
                </label>
                <input
                  id="siren"
                  name="siren"
                  required
                  pattern="[0-9]{9}"
                  maxLength={9}
                  className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold">
                  {d.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-semibold">
                  {d.phone}
                </label>
                <input
                  id="phone"
                  name="phone"
                  required
                  pattern="(\+33|0)[67][0-9]{8}"
                  placeholder="+33612345678"
                  maxLength={20}
                  className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-semibold">
                  {d.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  maxLength={2000}
                  className="w-full rounded-xl border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none"
                />
              </div>
              {error ? <p className="text-sm text-crimson-threat">{error}</p> : null}
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-pill bg-crimson-threat py-3.5 font-bold text-white hover:bg-crimson-hover disabled:opacity-60"
              >
                {status === "loading" ? d.sending : d.submit}
              </button>
            </form>
          )}
        </GlassCard>
      </FadeUp>
    </main>
  );
}
