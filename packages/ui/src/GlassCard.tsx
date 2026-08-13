import { cn } from "./utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-10",
};

export function GlassCard({
  children,
  className,
  padding = "md",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl",
        "shadow-[0_8px_32px_rgba(29,78,216,0.08)]",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
