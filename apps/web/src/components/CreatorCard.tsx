"use client";

import Image from "next/image";
import { useState } from "react";
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
    xl: "h-36 w-36 text-4xl",
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
        sizes="144px"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function CreatorCard({
  creator,
  layout = "horizontal",
}: {
  creator: Creator;
  layout?: "horizontal" | "vertical";
}) {
  if (layout === "vertical") {
    return (
      <article className="flex h-full flex-col rounded-2xl border border-border-subtle bg-white/80 p-8 shadow-card backdrop-blur-sm">
        <div className="mx-auto">
          <CreatorPortrait creator={creator} size="xl" />
        </div>
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-display text-2xl font-bold text-blue-navy">{creator.name}</h3>
            <FlagFR />
          </div>
          <p className="mt-2 text-sm font-semibold text-blue-primary">{creator.role}</p>
        </div>
        <p className="mt-4 flex-1 text-center text-sm leading-relaxed text-text-secondary">
          {creator.desc}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["SecNumCloud", "e-Evidence", "RGPD"].map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-blue-border bg-bg-blue-tint px-3 py-1 text-xs font-bold text-blue-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="flex gap-6 rounded-2xl border border-border-subtle bg-white/80 p-6 shadow-card backdrop-blur-sm">
      <CreatorPortrait creator={creator} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-blue-navy">{creator.name}</span>
          <FlagFR />
        </div>
        <div className="mt-1 text-sm font-semibold text-blue-primary">{creator.role}</div>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{creator.desc}</p>
      </div>
    </article>
  );
}
