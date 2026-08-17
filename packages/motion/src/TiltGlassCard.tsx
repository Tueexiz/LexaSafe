"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useMotionTemplate,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

const cardSpring = { type: "spring" as const, stiffness: 70, damping: 16, mass: 1.1 };

export function TiltGlassCard({
  children,
  className = "",
  index = 0,
  enterWithGsap = false,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  enterWithGsap?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 22 });
  const glareX = useTransform(mx, [-0.5, 0.5], [15, 85]);
  const glareY = useTransform(my, [-0.5, 0.5], [15, 85]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.5) 0%, transparent 58%)`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`h-full perspective-[1200px] ${className}`}
      initial={enterWithGsap ? false : { opacity: 0, rotateX: 24, y: 80 }}
      animate={enterWithGsap ? undefined : inView ? { opacity: 1, rotateX: 0, y: 0 } : undefined}
      transition={{ ...cardSpring, delay: index * 0.11 }}
    >
      <motion.div
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-8 shadow-[0_8px_40px_rgba(2,89,221,0.1)] max-md:backdrop-blur-none md:bg-white/30 md:backdrop-blur-2xl"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ scale: 1.012 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glareBg }}
          aria-hidden="true"
        />
        <motion.div
          className="relative z-10"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.18 + index * 0.07 } },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function TiltCardItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 32, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 110, damping: 15 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
