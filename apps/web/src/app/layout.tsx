import type { Metadata } from "next";
import "@lexasafe/ui/styles.css";
import "./globals.css";
import { clashDisplay, generalSans, syne } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://lexasafe.fr"),
  title: {
    default: "LexaSafe | Passerelle Souveraine de Réquisitions Judiciaires",
    template: "%s | LexaSafe France",
  },
  description:
    "Standard souverain français de traitement des réquisitions judiciaires. Bloquez les fraudes, évitez les amendes RGPD et respectez les délais e-Evidence.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "LexaSafe France",
    title: "LexaSafe | Passerelle Souveraine de Réquisitions Judiciaires",
    description:
      "Sécurisez et automatisez vos réquisitions judiciaires. 100% souverain, hébergé OVHcloud SecNumCloud.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={syne.variable}>
      <body className={`${clashDisplay.variable} ${generalSans.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
