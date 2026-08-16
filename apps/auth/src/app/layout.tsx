import "@lexasafe/ui/styles.css";
import "./globals.css";

export const metadata = {
  title: "Connexion Espace Sécurisé | LexaSafe",
  description:
    "Authentification souveraine forte LexaSafe. Accès réservé aux OPJ et DPO accrédités avec A2F et filtrage IP.",
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
