import Link from "next/link";
import { CheckCircle2, CircleAlert, CreditCard, ExternalLink, KeyRound, Sparkles } from "lucide-react";
import type { AiEnvStatus, AiProviderId } from "@/lib/ai/env";

const PROVIDERS: {
  id: AiProviderId;
  name: string;
  consoleLabel: string;
  consoleUrl: string;
  extraLinks?: { label: string; href: string }[];
  credits: string;
  envName: "GEMINI_API_KEY" | "LUMA_API_KEY" | "MESHY_API_KEY" | "SEEDANCE_API_KEY";
  usage: string;
}[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    consoleLabel: "Google AI Studio",
    consoleUrl: "https://aistudio.google.com/apikey",
    extraLinks: [{ label: "Documentation Gemini API", href: "https://ai.google.dev/gemini-api/docs" }],
    credits:
      "Quota gratuit inclus à la création de la clé. Pour la prod : activer la facturation Google Cloud (pay-as-you-go) dans AI Studio, puis surveiller l’usage et les plafonds.",
    envName: "GEMINI_API_KEY",
    usage: "Textes, extraits, aides à la rédaction — serveur uniquement via apps/web/src/lib/ai/gemini.ts.",
  },
  {
    id: "luma",
    name: "Luma Dream Machine",
    consoleLabel: "Luma Dream Machine API",
    consoleUrl: "https://lumalabs.ai/dream-machine/api",
    extraLinks: [
      { label: "Console clés (platform.lumalabs.ai)", href: "https://platform.lumalabs.ai" },
      { label: "Docs vidéo Dream Machine", href: "https://docs.lumalabs.ai/docs/video-generation" },
    ],
    credits:
      "L’URL produit ci-dessus redirige vers Luma Agents. Les clés API se créent sur platform.lumalabs.ai. Crédits via abonnement (Plus / Pro / Ultra) ou plafond de dépense dans le compte — chaque génération vidéo consomme des crédits.",
    envName: "LUMA_API_KEY",
    usage: "Génération vidéo (template serveur) via apps/web/src/lib/ai/luma.ts.",
  },
  {
    id: "meshy",
    name: "Meshy.ai",
    consoleLabel: "Meshy API",
    consoleUrl: "https://www.meshy.ai/api",
    extraLinks: [
      { label: "Réglages clés API", href: "https://www.meshy.ai/settings/api" },
      { label: "Docs text-to-3D", href: "https://docs.meshy.ai/en/api/text-to-3d" },
    ],
    credits:
      "Créer une clé (préfixe msy_) dans le dashboard. Créditer le compte via un plan Meshy (crédits mensuels) ou un achat de crédits. Une réponse 402 indique un solde insuffisant.",
    envName: "MESHY_API_KEY",
    usage: "Génération 3D (preview / refine / poll) via apps/web/src/lib/ai/meshy.ts.",
  },
  {
    id: "seedance",
    name: "ByteDance Seedance 1.5 Pro",
    consoleLabel: "fal.ai Seedance",
    consoleUrl: "https://fal.ai/models/fal-ai/bytedance/seedance/v1.5/pro/text-to-video",
    extraLinks: [
      { label: "Clés fal.ai (FAL_KEY)", href: "https://fal.ai/dashboard/keys" },
      { label: "BytePlus ModelArk", href: "https://docs.byteplus.com/en/docs/ModelArk/what_is_modelark" },
      { label: "Volcengine Ark", href: "https://www.volcengine.com/docs/82379" },
      { label: "Page film /demo", href: "/demo" },
    ],
    credits:
      "Endpoint public documenté : fal.ai (variable FAL_KEY ou SEEDANCE_API_KEY). BytePlus / Volcengine (ARK_API_KEY) est souvent gated. Un clip 720p ~8–12 s consomme des crédits fal.",
    envName: "SEEDANCE_API_KEY",
    usage: "Film produit marketing + dashboards via apps/web/src/lib/ai/seedance.ts et POST /api/demo/seedance.",
  },
];

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold ${
        ok
          ? "border border-blue-border bg-bg-blue-tint text-blue-primary"
          : "border border-crimson-border bg-crimson-bg text-crimson-threat"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />}
      {ok ? "Détectée" : "Absente"}
    </span>
  );
}

export function ApiSetup({ status }: { status: AiEnvStatus }) {
  const readyCount =
    Number(status.gemini) + Number(status.luma) + Number(status.meshy) + Number(status.seedance);

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-36">
      <div className="mb-10">
        <span className="mb-4 inline-flex items-center gap-2 rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
          <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
          Onboarding créatif
        </span>
        <h1 className="font-syne text-4xl font-extrabold text-blue-navy md:text-5xl">Configurer les APIs IA</h1>
        <p className="mt-4 max-w-2xl text-lg text-text-secondary">
          Trois services serveur historiques (Gemini, Luma, Meshy) plus Seedance pour le film produit. Les clés restent dans{" "}
          <code className="rounded bg-white/80 px-1.5 py-0.5 text-sm text-blue-navy">.env</code> — jamais en{" "}
          <code className="rounded bg-white/80 px-1.5 py-0.5 text-sm text-blue-navy">NEXT_PUBLIC_*</code>. Cette page
          n’affiche que la présence (oui / non), jamais la valeur.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/70 p-5 shadow-[0_8px_32px_rgba(2,89,221,0.08)] backdrop-blur-xl">
        <div>
          <p className="font-syne text-lg font-bold text-blue-navy">
            {readyCount} / 4 variables d’environnement détectées
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Copier <code className="text-blue-navy">.env.example</code> vers <code className="text-blue-navy">.env</code>{" "}
            à la racine du monorepo, remplir, relancer <code className="text-blue-navy">npm run dev:web</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 rounded-pill bg-blue-primary px-5 py-2.5 font-syne text-sm font-semibold text-white shadow-[0_4px_24px_rgba(2,89,221,0.35)] transition-colors hover:bg-blue-hover"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Film /demo
        </Link>
        <Link
          href="/poc"
          className="inline-flex items-center gap-2 rounded-pill border border-border-medium bg-white/80 px-5 py-2.5 font-syne text-sm font-semibold text-blue-navy hover:border-blue-primary"
        >
          POC hero
        </Link>
        </div>
      </div>

      <ol className="space-y-5">
        {PROVIDERS.map((provider, index) => {
          const ok = status[provider.id];
          return (
            <li
              key={provider.id}
              className="rounded-2xl border border-white/70 bg-white/75 p-6 shadow-[0_8px_32px_rgba(132,175,251,0.12)] backdrop-blur-xl md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-accent">Étape {index + 1}</p>
                  <h2 className="mt-1 font-syne text-2xl font-bold text-blue-navy">{provider.name}</h2>
                </div>
                <StatusPill ok={ok} />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{provider.usage}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={provider.consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-pill bg-blue-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-hover"
                >
                  {provider.consoleLabel}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                {provider.extraLinks?.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-pill border border-border-medium bg-white/80 px-4 py-2 text-sm font-semibold text-blue-navy hover:border-blue-primary hover:text-blue-primary"
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>

              <div className="mt-5 flex gap-3 rounded-xl border border-blue-border/70 bg-bg-blue-tint/80 p-4">
                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-blue-primary" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-text-secondary">{provider.credits}</p>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Variable : <span className="font-mono text-blue-navy">{provider.envName}</span>
              </p>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
