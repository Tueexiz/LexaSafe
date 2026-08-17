"use client";

import { useRef } from "react";
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
        `<span class="gsap-word inline-block overflow-hidden align-bottom"><span class="gsap-word-inner inline-block will-change-transform">${word}&nbsp;</span></span>`
    )
    .join("");
}

const enterOnce = {
  start: "top 80%",
  once: true,
} as const;

export function HomeScrollDirector() {
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const title = document.querySelector(".hero-title");
    const chars = gsap.utils.toArray<HTMLElement>(".hero-title-char");

    if (title && chars.length) {
      title.classList.add("is-gsap");
      if (!reduced) {
        gsap.fromTo(
          chars,
          { yPercent: 110, rotate: 1.2 },
          {
            yPercent: 0,
            rotate: 0,
            stagger: 0.016,
            duration: 0.62,
            ease: "power3.out",
            immediateRender: true,
          }
        );
      }
    }

    document.querySelectorAll(".gsap-copy").forEach(splitWords);

    if (reduced) return;

    const progress = progressRef.current;
    if (progress) {
      gsap.set(progress, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
        },
      });
    }

    gsap.utils.toArray<HTMLElement>(".gsap-copy").forEach((block) => {
      const inners = block.querySelectorAll<HTMLElement>(".gsap-word-inner");
      if (!inners.length) return;
      gsap.from(inners, {
        yPercent: 108,
        opacity: 0,
        rotate: 1.2,
        duration: 0.55,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: {
          trigger: block,
          ...enterOnce,
        },
      });
    });

    gsap.from(".hero-lead", {
      y: 18,
      opacity: 0,
      duration: 0.55,
      delay: 0.85,
      ease: "power2.out",
    });

    gsap.from(".wf-step", {
      opacity: 0,
      y: 40,
      rotate: 2.4,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#workflow",
        ...enterOnce,
      },
    });

    gsap.from(".calc-panel", {
      opacity: 0,
      y: 28,
      rotate: 1.2,
      duration: 0.65,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#calculator",
        ...enterOnce,
      },
    });

    gsap.from(".danger-card", {
      opacity: 0,
      y: 32,
      rotate: -1.8,
      duration: 0.65,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#dangers",
        ...enterOnce,
      },
    });

    gsap.from(".adv-card", {
      opacity: 0,
      y: 36,
      rotate: 1.6,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#avantages",
        ...enterOnce,
      },
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div
      ref={progressRef}
      className="pointer-events-none fixed left-0 right-0 top-0 z-[999] h-[2px] origin-left bg-[#0259DD]"
      aria-hidden="true"
    />
  );
}
