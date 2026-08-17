"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ShieldCheck, Stamp, Waypoints } from "lucide-react";
import { subscribeLenis } from "@lexasafe/motion";

gsap.registerPlugin(useGSAP);

const SecureFlowCanvas = dynamic(
  () => import("./SecureFlowCanvas").then((m) => m.SecureFlowCanvas),
  { ssr: false }
);

const TITLE = "Réquisition souveraine";

const CARDS = [
  {
    initials: "OP",
    title: "OPJ vérifié",
    body: "Identité contrôlée, canal chiffré, preuve d’habilitation avant toute extraction.",
    icon: ShieldCheck,
  },
  {
    initials: "EN",
    title: "Relais entreprise",
    body: "La donnée circule sans exposer le SI : périmètre, horodatage, journal d’audit.",
    icon: Waypoints,
  },
  {
    initials: "SC",
    title: "Archive scellée",
    body: "Remise intègre, délai e-Evidence tenu, scellement prêt pour la chaîne de custody.",
    icon: Stamp,
  },
] as const;

function ScrollTriggerBridge() {
  useEffect(() => {
    let off: (() => void) | void;
    const unsub = subscribeLenis((lenis) => {
      off?.();
      off = undefined;
      if (!lenis) return;
      const maybeOff = lenis.on("scroll", () => ScrollTrigger.update());
      off = typeof maybeOff === "function" ? maybeOff : undefined;
      ScrollTrigger.refresh();
    });
    return () => {
      off?.();
      unsub();
    };
  }, []);
  return null;
}

function MagneticCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });

  function onMove(event: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.16);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.16);
  }

  return (
    <motion.article
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="poc-card ios-glass relative rounded-2xl p-6"
    >
      {children}
    </motion.article>
  );
}

function IosAvatar({ initials }: { initials: string }) {
  return (
    <div className="relative h-14 w-14 shrink-0">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#84AFFB] to-[#0259DD] shadow-[0_8px_20px_rgba(2,89,221,0.28)] ring-[3px] ring-white"
        aria-hidden="true"
      />
      <span className="relative z-[1] flex h-full w-full items-center justify-center font-syne text-sm font-bold text-white">
        {initials}
      </span>
    </div>
  );
}

function HeroRequisitionInner() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      // SplitText is Club GSAP (paid) and is not shipped in the public `gsap` package.
      // Letters are split in React; GSAP animates those spans. ScrollTrigger lives only here so useGSAP can revert it.
      gsap.registerPlugin(ScrollTrigger);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".poc-letter", {
        yPercent: 110,
        opacity: 0,
        rotate: 1.6,
        stagger: 0.028,
        duration: 0.72,
        ease: "power3.out",
      });

      gsap.from(".poc-card", {
        y: 48,
        opacity: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".poc-cards",
          start: "top 82%",
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative min-h-[100dvh] overflow-hidden bg-[#FBF8F4]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <SecureFlowCanvas />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-6 pb-24 pt-32">
        <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.26em] text-text-muted">
          Proof of concept · flux sécurisé
        </p>
        <h1
          className="font-syne font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-blue-navy [font-size:clamp(2.1rem,6.4vw,5.2rem)]"
          aria-label={TITLE}
        >
          {TITLE.split("").map((char, index) => (
            <span key={`${char}-${index}`} className="inline-block overflow-hidden align-bottom">
              <span className="poc-letter inline-block will-change-transform">
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-text-secondary">
          Canvas R3F en fond : géométrie abstraite d’un flux de données. Les cartes ci-dessous sont les seuls
          éléments magnétiques de cette POC — les CTA du site marketing restent inchangés.
        </p>

        <div className="poc-cards mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((card) => (
            <MagneticCard key={card.title}>
              <div className="relative z-[1] flex items-start gap-4">
                <IosAvatar initials={card.initials} />
                <div>
                  <div className="mb-2 flex items-center gap-2 text-blue-primary">
                    <card.icon className="h-4 w-4" aria-hidden="true" />
                    <h2 className="font-syne text-lg font-bold text-blue-navy">{card.title}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">{card.body}</p>
                </div>
              </div>
            </MagneticCard>
          ))}
        </div>

        {reducedMotion ? (
          <p className="mt-8 text-xs text-text-muted">Animations réduites (préférence système détectée).</p>
        ) : null}
      </div>
    </section>
  );
}

export function HeroRequisition() {
  return (
    <>
      <ScrollTriggerBridge />
      <HeroRequisitionInner />
    </>
  );
}
