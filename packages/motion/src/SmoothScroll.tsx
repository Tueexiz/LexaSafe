"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setLenisInstance, type LenisLike } from "./lenis-store";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisLike | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || prefersReduced) return;

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        lerp: 0.16,
        duration: 0.62,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
      });
      lenisRef.current = lenis as unknown as LenisLike;
      setLenisInstance(lenis as unknown as LenisLike);

      lenis.on("scroll", () => {
        window.dispatchEvent(new Event("lexasafe:scroll"));
      });

      const raf = (time: number) => {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      setLenisInstance(null);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
