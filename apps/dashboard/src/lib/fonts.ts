import { Syne } from "next/font/google";
import localFont from "next/font/local";

export const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
});

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
