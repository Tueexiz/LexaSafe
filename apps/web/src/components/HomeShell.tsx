"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { MotionProviders } from "./MotionProviders";

const AmbientBackground = dynamic(
  () => import("@lexasafe/ui").then((m) => ({ default: m.AmbientBackground })),
  { ssr: false }
);

export function HomeShell({ children }: { children: ReactNode }) {
  return (
    <MotionProviders>
      <AmbientBackground />
      {children}
    </MotionProviders>
  );
}
