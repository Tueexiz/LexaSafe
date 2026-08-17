"use client";

import dynamic from "next/dynamic";
import { useMediaCapabilities } from "@lexasafe/motion";
import type { ReactNode } from "react";

const CustomCursor = dynamic(
  () => import("@lexasafe/motion").then((m) => ({ default: m.CustomCursor })),
  { ssr: false }
);

export function MotionProviders({ children }: { children: ReactNode }) {
  const { finePointer, reducedMotion } = useMediaCapabilities();
  const enableMotionChrome = finePointer && !reducedMotion;

  return (
    <>
      {enableMotionChrome && <CustomCursor />}
      {children}
    </>
  );
}
