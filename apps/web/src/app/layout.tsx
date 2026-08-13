import { Inter, Syne } from "next/font/google";
import "@lexasafe/ui/styles.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata = {
  title: "LexaSafe | Passerelle Souveraine de Réquisitions Judiciaires",
  description:
    "Standard souverain français de traitement des réquisitions judiciaires. Bloquez les faux policiers, évitez les amendes de 2% du CA et respectez les délais d'urgence de la loi e-Evidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${syne.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
