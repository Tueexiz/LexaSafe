import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lexasafe.fr";
  const lastMod = new Date("2026-08-13");
  return [
    { url: base, lastModified: lastMod, changeFrequency: "daily", priority: 1 },
    { url: `${base}/demo`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/createurs`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.8 },
  ];
}
