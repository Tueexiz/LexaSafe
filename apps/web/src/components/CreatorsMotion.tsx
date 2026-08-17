"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function splitWords(el: Element) {
  if (el.getAttribute("data-gsap-split") === "1") return;
  const text = el.textContent ?? "";
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return;
  el.setAttribute("data-gsap-split", "1");
  el.innerHTML = words
    .map(
      (word) =>
        `<span class="inline-block overflow-hidden align-bottom"><span class="creators-word inline-block will-change-transform">${word}&nbsp;</span></span>`
    )
    .join("");
}

export function CreatorsMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      root.current?.querySelectorAll(".creators-copy").forEach(splitWords);

      gsap.from(".creators-word", {
        yPercent: 110,
        autoAlpha: 0,
        rotation: 1.2,
        duration: 0.55,
        stagger: 0.028,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".creator-card-enter", {
        autoAlpha: 0,
        y: 36,
        scale: 0.94,
        rotation: 2.2,
        duration: 0.7,
        stagger: 0.14,
        ease: "power3.out",
        transformOrigin: "50% 110%",
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".creators-contact", {
        autoAlpha: 0,
        y: 22,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".creators-contact",
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: root }
  );

  return <div ref={root}>{children}</div>;
}
