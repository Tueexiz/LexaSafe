"use client";

import Image from "next/image";
import { useState } from "react";
import { Linkedin, ArrowUpRight } from "lucide-react";
import { motion } from "@lexasafe/motion";
import { FlagFR } from "@lexasafe/ui";
import type { Creator } from "@/content/creators";

export type { Creator };

export function CreatorPortrait({
  creator,
  size = "lg",
}: {
  creator: Creator;
  size?: "md" | "lg" | "xl";
}) {
  const [failed, setFailed] = useState(false);
  const sizes = {
    md: "h-20 w-20 text-2xl",
    lg: "h-28 w-28 text-3xl",
    xl: "h-32 w-32 text-4xl",
  };

  if (failed) {
    return (
      <div
        className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-2xl border-2 border-blue-border bg-bg-blue-tint font-display font-extrabold text-blue-primary shadow-sm`}
      >
        {creator.initials}
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} relative shrink-0 overflow-hidden rounded-2xl border-2 border-blue-border bg-bg-blue-tint shadow-sm`}
    >
      <Image
        src={creator.portrait}
        alt={creator.name}
        fill
        className="object-cover"
        sizes="128px"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function CreatorCard({
  creator,
  index = 0,
}: {
  creator: Creator;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 80, damping: 16 }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/60 p-8 shadow-[0_8px_40px_rgba(2,89,221,0.08)] backdrop-blur-xl transition-colors hover:border-blue-border"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-accent/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-5">
        <motion.div whileHover={{ scale: 1.04, rotate: -1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
          <CreatorPortrait creator={creator} size="xl" />
        </motion.div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-2xl font-bold text-blue-navy">{creator.name}</h3>
            <FlagFR />
          </div>
          <p className="mt-1 text-sm font-semibold text-blue-primary">{creator.role}</p>
        </div>
      </div>

      <p className="relative mt-6 flex-1 text-sm leading-relaxed text-text-secondary">
        {creator.desc}
      </p>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {creator.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-blue-border bg-bg-blue-tint px-3 py-1 text-xs font-bold text-blue-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mt-6 flex items-center gap-3">
        <a
          href={creator.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${creator.name}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Linkedin className="h-4 w-4" aria-hidden="true" />
          LinkedIn
        </a>
        <a
          href={creator.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Portfolio de ${creator.name}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-medium bg-white px-4 py-2.5 text-sm font-bold text-blue-navy transition-colors hover:border-blue-primary hover:text-blue-primary"
        >
          Portfolio
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}
