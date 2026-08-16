import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique de Confidentialité (RGPD) | LexaSafe France",
  description:
    "Politique de protection des données personnelles, architecture Zero-Knowledge et exercice des droits RGPD de LexaSafe.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout
      badge="Gouvernance RGPD & Chiffrement E2EE"
      title="Politique de Confidentialité"
      subtitle="Conformité stricte au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés."
    >
      <h2>1. Principe Fondamental de Zero-Knowledge</h2>
      <p>
        Chez LexaSafe, la confidentialité est une réalité mathématique. Les fichiers transmis dans le
        cadre des réquisitions judiciaires sont chiffrés de bout en bout (E2EE) avant leur transit.
        LexaSafe ne possède aucune clé de déchiffrement.
      </p>

      <h2>2. Données Collectées &amp; Finalités</h2>
      <p>
        Les données personnelles traitées sont strictement limitées à la gestion des accès accrédités :
        <br />• <strong>Comptes OPJ :</strong> nom, prénom, adresse institutionnelle (.gouv.fr),
        matricule, unité.
        <br />• <strong>Comptes Entreprises :</strong> DPO / juriste, email professionnel, téléphone
        E.164, SIREN/SIRET.
      </p>

      <h2>3. Durée de Conservation &amp; Registre CNIL</h2>
      <p>
        Les métadonnées de remise (horodatage, empreinte SHA-256, accusé de réception) sont conservées
        dans un journal d&apos;audit infalsifiable pendant la durée légale de prescription pénale.
      </p>

      <h2>4. Exercice des Droits &amp; DPO</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement. Contact DPO
        : <a href="mailto:dpo@lexasafe.fr">dpo@lexasafe.fr</a>. En cas d&apos;effacement légitime,
        LexaSafe applique le <em>Crypto-Shredding</em> (destruction irréversible des clés
        cryptographiques).
      </p>

      <h2>5. Réclamation auprès de la CNIL</h2>
      <p>
        Vous pouvez introduire une réclamation auprès de la CNIL (3 Place de Fontenoy, 75007 Paris —{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        ).
      </p>
    </LegalPageLayout>
  );
}
