"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Building2, BadgeCheck, Lock, Smartphone, ShieldCheck } from "lucide-react";
import { ScannerQR } from "@lexasafe/motion";
import { logger } from "@/lib/logger";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.lexasafe.fr";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.lexasafe.fr";
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? "https://lexasafe.fr";

const easing = [0.16, 1, 0.3, 1]; // Custom cubic-bezier for buttery smooth animations

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
};

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"opj" | "enterprise">("enterprise");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otpauthUri, setOtpauthUri] = useState("");
  const [enroll, setEnroll] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    logger.info("Login page mounted");
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    logger.info({ email, role }, "Tentative de connexion (Etape 1)");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        logger.warn({ status: res.status, error: data.detail }, "Echec login");
        throw new Error(data.detail ?? "Identifiants invalides");
      }
      logger.info({ challengeId: data.challenge_id }, "Login Etape 1 réussi, attente A2F");
      setChallengeId(data.challenge_id);
      setEnroll(Boolean(data.enroll));
      setOtpauthUri(typeof data.otpauth_uri === "string" ? data.otpauth_uri : "");
      setTotp("");
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
    logger.info({ challengeId }, "Tentative A2F (Etape 2)");
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ challenge_id: challengeId, totp_code: totp }),
      });
      const data = await res.json();
      if (!res.ok) {
        logger.warn({ status: res.status, error: data.detail }, "Echec validation A2F");
        throw new Error(data.detail ?? "Code A2F invalide");
      }
      
      logger.info("Authentification réussie");

      if (data.access_token) {
        // TODO: Déplacer ce token vers un HttpOnly Cookie sécurisé pour l'ANSSI.
        // C'est actuellement une vulnérabilité XSS potentielle en environnement Zéro Confiance.
        localStorage.setItem("lexasafe_token", data.access_token);
        localStorage.setItem("lexasafe_user", JSON.stringify(data.user ?? {}));
      }

      const apiRole = data.user?.role as string | undefined;
      const dest =
        apiRole === "super_admin"
          ? `${APP_URL}/admin/checklist`
          : apiRole === "dpo_enterprise" || role === "enterprise"
            ? `${APP_URL}/entreprise`
            : `${APP_URL}/dashboard`;
      
      router.push(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur A2F");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans relative overflow-hidden flex items-center justify-center">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen pointer-events-none" />

      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: easing }}
        >
          <a
            href={WEB_URL}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-xl"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour
          </a>
        </motion.div>
      </header>

      <main className="relative z-10 w-full max-w-md px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-2xl ring-1 ring-white/5"
        >
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/10 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="font-display font-bold text-3xl text-white tracking-tight mb-2" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>LexaSafe</h1>
            <p className="text-sm font-medium text-cyan-400 tracking-wide">
              {step === 1 ? "PORTAIL DE SÉCURITÉ ZERO TRUST" : "VÉRIFICATION A2F REQUISE"}
            </p>
          </motion.div>

          {!mounted ? (
             <div className="h-64 animate-pulse bg-white/5 rounded-xl" />
          ) : step === 1 ? (
            <form onSubmit={handleLogin} className="space-y-5" autoComplete="on">
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("enterprise")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    role === "enterprise"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                      : "border-white/10 bg-transparent text-slate-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Privé
                </button>
                <button
                  type="button"
                  onClick={() => setRole("opj")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    role === "opj"
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                      : "border-white/10 bg-transparent text-slate-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <BadgeCheck className="h-4 w-4" />
                  État
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse email"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-5 py-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-5 py-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="flex justify-end">
                  <Link href="/reset" className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-semibold text-red-400 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-4 font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
              >
                {loading ? "Chiffrement en cours..." : "Connexion"}
              </motion.button>
            </form>
          ) : (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: easing }}
              onSubmit={handleA2F} 
              className="space-y-6"
            >
              <div className="text-center">
                {enroll && otpauthUri ? (
                  <div className="space-y-5">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Liaison de votre appareil requise. Scannez ce QR Code avec <span className="text-cyan-400">Aegis</span> ou <span className="text-cyan-400">FreeOTP</span>.
                    </p>
                    <ScannerQR uri={otpauthUri} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Smartphone className="h-12 w-12 text-cyan-400 mb-3" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Saisissez le code à 6 chiffres généré par votre application d'authentification.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <input
                  id="totp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={totp}
                  onChange={(e) => setTotp(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • • • •"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-5 text-center text-3xl font-mono tracking-[0.5em] text-cyan-400 placeholder-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-semibold text-red-400 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-4 font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
              >
                {loading ? "Vérification cryptographique..." : "Autoriser l'accès"}
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpauthUri("");
                  setEnroll(false);
                  setTotp("");
                  setError("");
                }}
                className="w-full text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-white transition-colors"
              >
                Annuler
              </button>
            </motion.form>
          )}
        </motion.div>
      </main>
    </div>
  );
}
