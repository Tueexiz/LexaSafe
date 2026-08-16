import { Syne } from "next/font/google";
import localFont from "next/font/local";

/** Hero display: ExtraBold 800 only */
export const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
});

/** Critical display weights only — preloaded by Next.js */
export const clashDisplay = localFont({
  src: [
    {
      path: "../../../../packages/ui/fonts/clash-display-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../packages/ui/fonts/clash-display-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

/** Body: 400 + 600 only (skip 500/700 to cut font bytes) */
export const generalSans = localFont({
  src: [
    {
      path: "../../../../packages/ui/fonts/general-sans-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../packages/ui/fonts/general-sans-600.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
  preload: true,
});
