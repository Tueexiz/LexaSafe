import "@lexasafe/ui/styles.css";
import "./globals.css";

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
    <html lang="fr">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
