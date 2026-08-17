"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "@lexasafe/motion";
import { cn } from "@lexasafe/ui";

export function DashCard({
  children,
  className,
  padding = "md",
}: {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20 });
  const springY = useSpring(y, { stiffness: 260, damping: 20 });

  const pad = padding === "sm" ? "p-4" : padding === "lg" ? "p-8" : "p-6";

  function onMove(event: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.08);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.08);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn(
        "dash-card ios-glass relative rounded-2xl border border-white/50 bg-white/55 shadow-[0_10px_40px_rgba(2,89,221,0.08)] backdrop-blur-2xl",
        pad,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
