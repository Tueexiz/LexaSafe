"use client";

import { useEffect, useState } from "react";

export function useMediaCapabilities() {
  const [finePointer, setFinePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const pointerMq = window.matchMedia("(pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setFinePointer(pointerMq.matches);
      setReducedMotion(motionMq.matches);
    };

    sync();
    pointerMq.addEventListener("change", sync);
    motionMq.addEventListener("change", sync);

    return () => {
      pointerMq.removeEventListener("change", sync);
      motionMq.removeEventListener("change", sync);
    };
  }, []);

  return { finePointer, reducedMotion, liteEffects: !finePointer || reducedMotion };
}
