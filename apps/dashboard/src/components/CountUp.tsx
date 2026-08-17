"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        if (ref.current) ref.current.textContent = String(value);
        return;
      }
      const proxy = { n: 0 };
      gsap.to(proxy, {
        n: value,
        duration: 1.15,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current) ref.current.textContent = String(Math.round(proxy.n));
        },
      });
    },
    { dependencies: [value], revertOnUpdate: true }
  );

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
