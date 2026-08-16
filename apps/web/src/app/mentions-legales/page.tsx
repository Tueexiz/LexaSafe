import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Mentions Légales | LexaSafe France",
  description:
    "Mentions légales de LexaSafe France : éditeur, hébergement OVHcloud SecNumCloud ANSSI, propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout
      badge="Transparence & Conformité Française"
      title="Mentions Légales"
      subtitle="Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 (LCEN)."
    >
      <h2>1. Éditeur de la Plateforme</h2>
      <p>
        <strong>Société :</strong> LexaSafe France SAS (Société par Actions Simplifiée en cours
        d&apos;immatriculation)
        <br />
        <strong>Fondateurs &amp; Dirigeants :</strong> 0xzEus (Directeur de la Cybersécurité) &amp;
        Tueexiz (Président &amp; Lead Développeur)
        <br />
        <strong>Contact officiel :</strong> <a href="mailto:contact@lexasafe.fr">contact@lexasafe.fr</a>
        <br />
        <strong>Délégué à la Protection des Données (DPO) :</strong>{" "}
        <a href="mailto:dpo@lexasafe.fr">dpo@lexasafe.fr</a>
      </p>

      <h2>2. Hébergement 100% Souverain Français</h2>
      <p>
        L&apos;ensemble de l&apos;infrastructure de production, des bases de données et des enclaves de
        chiffrement de LexaSafe est hébergé exclusivement sur le territoire français :
        <br />
        <br />
        <strong>Hébergeur :</strong> OVHcloud SAS
        <br />
        <strong>Siège social :</strong> 2 rue Kellermann — 59100 Roubaix — France
        <br />
        <strong>Qualification :</strong> Datacenters qualifiés <strong>SecNumCloud ANSSI</strong> et
        certifiés ISO/IEC 27001, HDS.
        <br />
        <strong>Immunité juridique :</strong> 100% Souveraineté européenne — zéro transfert
        extraterritorial (immunité au CLOUD Act américain).
      </p>

      <h2>3. Propriété Intellectuelle &amp; Marques</h2>
      <p>
        La marque LexaSafe, son logo, sa charte graphique, son architecture logicielle et ses codes
        sources sont protégés par le Code de la Propriété Intellectuelle. Toute reproduction totale ou
        partielle sans autorisation expresse est strictement interdite.
      </p>

      <h2>4. Directeur de la Publication</h2>
      <p>
        Tueexiz, en qualité de Président de LexaSafe France SAS.
      </p>
    </LegalPageLayout>
  );
}
