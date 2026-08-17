"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { subscribeLenis } from "@lexasafe/motion";

gsap.registerPlugin(ScrollTrigger);

export function LenisScrollBridge() {
  const offRef = useRef<(() => void) | void>(undefined);

  useEffect(() => {
    const unsub = subscribeLenis((lenis) => {
      offRef.current?.();
      offRef.current = undefined;
      if (!lenis) return;
      const maybeOff = lenis.on("scroll", () => {
        ScrollTrigger.update();
      });
      offRef.current = typeof maybeOff === "function" ? maybeOff : undefined;
      ScrollTrigger.refresh();
    });

    return () => {
      offRef.current?.();
      unsub();
    };
  }, []);

  return null;
}
