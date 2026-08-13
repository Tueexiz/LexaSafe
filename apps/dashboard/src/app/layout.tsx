import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/syne/500.css";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
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
      <body
        className="font-body antialiased"
        style={
          {
            "--font-syne": "Syne",
            "--font-inter": "Inter",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
