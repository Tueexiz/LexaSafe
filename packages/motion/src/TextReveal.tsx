"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const spring = { type: "spring" as const, stiffness: 90, damping: 18, mass: 0.9 };
const wordStagger = 0.075;

type TitleLine = {
  text: string;
  className?: string;
};

export function TextReveal({
  text,
  className,
  delay = 0,
  by = "word",
}: {
  text: string;
  className?: string;
  delay?: number;
  by?: "word" | "char";
}) {
  const units = by === "char" ? text.split("") : text.split(" ");
  const stagger = by === "char" ? 0.025 : wordStagger;

  return (
    <span className={className} aria-label={text}>
      {units.map((unit, i) => (
        <span key={`${unit}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%", rotate: 1.5 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ ...spring, delay: delay + i * stagger }}
          >
            {by === "word" ? (
              <>
                {unit}
                {i < units.length - 1 ? "\u00A0" : ""}
              </>
            ) : unit === " " ? (
              "\u00A0"
            ) : (
              unit
            )}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Multi-line hero title — words reveal in strict order across all lines. */
export function HeroTitleReveal({
  lines,
  baseDelay = 0.35,
  stagger = wordStagger,
  className,
}: {
  lines: TitleLine[];
  baseDelay?: number;
  stagger?: number;
  className?: string;
}) {
  let wordIndex = 0;

  return (
    <span className={className}>
      {lines.map((line, lineIdx) => {
        const words = line.text.split(" ");
        return (
          <span key={lineIdx} className="block">
            {words.map((word, i) => {
              const idx = wordIndex++;
              return (
                <span key={`${lineIdx}-${i}`} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className={`inline-block will-change-transform ${line.className ?? ""}`}
                    initial={{ y: "110%", rotate: 1.5 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ ...spring, delay: baseDelay + idx * stagger }}
                  >
                    {word}
                    {i < words.length - 1 ? "\u00A0" : ""}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

export function TextRevealBlock({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`inline-block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ ...spring, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
