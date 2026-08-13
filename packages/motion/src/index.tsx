"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export function FadeUp({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={index}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

export function MagneticButton({
  children,
  className,
  ...props
}: HTMLMotionProps<"a"> & { children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export function PulseCTA({
  children,
  className,
  ...props
}: HTMLMotionProps<"a"> & { children: ReactNode }) {
  return (
    <motion.a
      className={className}
      animate={{
        boxShadow: [
          "0 4px 18px rgba(220, 38, 38, 0.28)",
          "0 8px 32px rgba(220, 38, 38, 0.42)",
          "0 4px 18px rgba(220, 38, 38, 0.28)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
}) {
  const spring = useSpring(value, { stiffness: 120, damping: 28, mass: 0.8 });
  const display = useTransform(spring, (latest) => format(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useMotionValueEvent(display, "change", (latest) => {
    if (ref.current) ref.current.textContent = latest;
  });

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

export { motion, AnimatePresence } from "framer-motion";
