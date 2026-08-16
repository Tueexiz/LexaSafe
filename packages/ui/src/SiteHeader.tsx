"use client";

import { useEffect, useState } from "react";
import { cn } from "./utils";

export function SiteHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollY > 20);
      setProgress(docHeight > 0 ? scrollY / docHeight : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-4 z-[1000] flex justify-center pointer-events-none",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-auto relative flex items-center gap-8 rounded-pill border border-white/30",
          "bg-white/90 px-5 py-2.5 shadow-capsule backdrop-blur-xl transition-all duration-300",
          scrolled && "bg-white/98 shadow-card"
        )}
      >
        <div
          className="absolute bottom-0 left-4 right-4 h-0.5 origin-left rounded-full bg-blue-primary"
          style={{ transform: `scaleX(${progress})` }}
        />
        {children}
      </div>
    </header>
  );
}

export function SectionTag({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span className="mb-5 inline-flex items-center gap-2 rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
      {icon}
      {children}
    </span>
  );
}

export function SectionHeader({
  tag,
  title,
  description,
}: {
  tag?: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      {tag}
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-blue-navy md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-text-secondary">{description}</p>
      )}
    </div>
  );
}

export function FlagFR() {
  return (
    <span className="inline-flex h-3 w-[17px] shrink-0 overflow-hidden rounded-sm shadow-[0_0_0_1px_rgba(0,0,0,0.1)]">
      <span className="w-1/3 bg-[#002654]" />
      <span className="w-1/3 bg-white" />
      <span className="w-1/3 bg-[#ce1126]" />
    </span>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "dark";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    primary:
      "bg-blue-primary text-white shadow-[0_4px_18px_rgba(2,89,221,0.28)] hover:bg-blue-hover hover:-translate-y-0.5",
    secondary:
      "bg-white text-blue-navy border border-border-medium hover:border-blue-primary hover:text-blue-primary hover:-translate-y-0.5",
    danger:
      "bg-crimson-threat text-white shadow-danger hover:bg-crimson-hover hover:-translate-y-0.5",
    dark: "bg-blue-navy text-white hover:bg-[#112240] hover:-translate-y-0.5",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-10 py-4 text-lg",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-300",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function CTAButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-pill bg-crimson-threat px-8 py-3.5",
        "text-base font-bold text-white shadow-danger transition-all duration-300",
        "hover:-translate-y-0.5 hover:bg-crimson-hover",
        className
      )}
    >
      {children}
    </a>
  );
}
