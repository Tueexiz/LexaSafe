import "@lexasafe/ui/styles.css";
import "./globals.css";
import { clashDisplay, generalSans, syne } from "@/lib/fonts";

export const metadata = {
  title: "LexaSafe | Espace Opérationnel",
  description: "Dashboard souverain LexaSafe pour réquisitions judiciaires.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={syne.variable}>
      <body className={`${clashDisplay.variable} ${generalSans.variable} font-body antialiased`}>{children}</body>
    </html>
  );
}
