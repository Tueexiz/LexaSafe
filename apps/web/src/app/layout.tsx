import type { Metadata } from "next";
import "@lexasafe/ui/styles.css";
import "./globals.css";
import { clashDisplay, generalSans, syne } from "@/lib/fonts";
import { getLocale } from "@/i18n/server";
import { I18nProvider } from "@/i18n/I18nProvider";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={syne.variable}>
      <body className={`${clashDisplay.variable} ${generalSans.variable} font-body antialiased`}>
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
