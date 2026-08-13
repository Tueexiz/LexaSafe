"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, BadgeCheck, Lock, Smartphone } from "lucide-react";
import { AmbientBackground, GlassCard } from "@lexasafe/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"opj" | "enterprise">("enterprise");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Identifiants invalides");
      setChallengeId(data.challenge_id);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  async function handleA2F(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/a2f/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ challenge_id: challengeId, totp_code: totp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Code A2F invalide");
      const dest = role === "enterprise" ? `${APP_URL}/entreprise` : `${APP_URL}/dashboard`;
      router.push(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur A2F");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AmbientBackground />
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="rounded-pill border border-white/30 bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl">
          <a
            href={WEB_URL}
            className="flex items-center gap-2 text-sm font-semibold text-blue-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour Accueil
          </a>
        </div>
      </header>
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-12 pt-32">
        <GlassCard padding="lg" className="w-full max-w-md bg-white/95">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-blue-tint text-blue-primary">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-blue-navy">Espace Sécurisé</h1>
          </div>

          <p className="mb-5 text-center text-sm font-semibold leading-relaxed text-emerald-valid">
            Authentification A2F obligatoire
          </p>

          {!mounted ? (
            <div className="space-y-4" aria-hidden="true">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 rounded-lg bg-border-medium/30" />
                <div className="h-12 rounded-lg bg-border-medium/30" />
              </div>
              <div className="h-12 rounded-lg bg-border-medium/30" />
              <div className="h-12 rounded-lg bg-border-medium/30" />
              <div className="h-12 rounded-lg bg-blue-primary/40" />
            </div>
          ) : step === 1 ? (
            <form
              onSubmit={handleLogin}
              className="space-y-4"
              autoComplete="on"
              suppressHydrationWarning
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("enterprise")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-3 text-sm font-semibold transition ${
                    role === "enterprise"
                      ? "border-blue-navy bg-blue-navy text-white"
                      : "border-border-medium bg-white text-blue-navy hover:border-blue-primary"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Entreprise &amp; DPO
                </button>
                <button
                  type="button"
                  onClick={() => setRole("opj")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-3 text-sm font-semibold transition ${
                    role === "opj"
                      ? "border-blue-navy bg-blue-navy text-white"
                      : "border-border-medium bg-white text-blue-navy hover:border-blue-primary"
                  }`}
                >
                  <BadgeCheck className="h-4 w-4" />
                  Officier OPJ
                </button>
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  suppressHydrationWarning
                  className="w-full rounded-lg border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-semibold">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={128}
                  suppressHydrationWarning
                  className="w-full rounded-lg border border-border-medium px-4 py-3 text-sm focus:border-blue-primary focus:outline-none"
                />
              </div>
              <Link href="/reset" className="text-xs font-semibold text-blue-primary hover:underline">
                Mot de passe oublié ?
              </Link>
              {error && <p className="text-sm text-crimson-threat">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-primary py-3 font-semibold text-white hover:bg-blue-hover disabled:opacity-60"
              >
                {loading ? "Vérification..." : "Étape suivante : Validation A2F"}
              </button>
              <div className="border-t border-border-medium pt-4 text-center">
                <p className="mb-2 text-xs text-text-secondary">
                  Pas encore de compte OPJ accrédité ?
                </p>
                <Link
                  href="/demande-compte-opj"
                  className="text-sm font-semibold text-blue-primary hover:underline"
                >
                  Demande de création de compte OPJ
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleA2F} className="space-y-4" suppressHydrationWarning>
              <div className="text-center">
                <Smartphone className="mx-auto mb-3 h-10 w-10 text-blue-primary" />
                <p className="text-sm font-semibold text-emerald-valid">
                  Authentification A2F obligatoire
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Entrez le code TOTP de votre application authenticator
                </p>
              </div>
              <input
                id="totp"
                name="totp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoComplete="one-time-code"
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                suppressHydrationWarning
                className="w-full rounded-lg border border-border-medium px-4 py-4 text-center text-2xl tracking-[0.5em] focus:border-blue-primary focus:outline-none"
              />
              {error && <p className="text-sm text-crimson-threat">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-primary py-3 font-semibold text-white hover:bg-blue-hover disabled:opacity-60"
              >
                {loading ? "Validation..." : "Accéder au portail sécurisé"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-text-muted hover:text-blue-primary"
              >
                ← Retour
              </button>
            </form>
          )}
        </GlassCard>
      </main>
    </>
  );
}
