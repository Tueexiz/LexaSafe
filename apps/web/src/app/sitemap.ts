import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lexasafe.fr";
  const lastMod = new Date("2026-08-13");
  return [
    { url: base, lastModified: lastMod, changeFrequency: "daily", priority: 1 },
    { url: `${base}/acces`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/inscription/entreprise`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/inscription/opj`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/demo`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/createurs`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/mentions-legales`, lastModified: lastMod, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/cgu`, lastModified: lastMod, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/politique-confidentialite`, lastModified: lastMod, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/cookies`, lastModified: lastMod, changeFrequency: "yearly", priority: 0.3 },
  ];
}
