import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "CGU & SLA | LexaSafe France",
  description:
    "Conditions Générales d'Utilisation et engagements de niveau de service (SLA) de la plateforme souveraine LexaSafe.",
};

export default function CguPage() {
  return (
    <LegalPageLayout
      badge="Cadre Contractuel B2B & Souveraineté"
      title="Conditions Générales d'Utilisation (CGU)"
      subtitle="Dernière mise à jour : 13 août 2026 — Conforme CPP Art. 60-1 / 60-2 & Règlement e-Evidence 2026"
    >
      <h2>1. Objet et Champ d&apos;Application</h2>
      <p>
        Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et
        l&apos;utilisation de la plateforme <strong>LexaSafe</strong>, éditée par LexaSafe France SAS
        (en cours de constitution). LexaSafe fournit une passerelle souveraine sécurisée facilitant la
        réception, l&apos;authentification et le traitement chiffré des réquisitions judiciaires.
      </p>

      <h2>2. Architecture Zéro Connaissance (Zero-Knowledge)</h2>
      <p>
        LexaSafe s&apos;engage sur l&apos;étanchéité cryptographique de sa solution. Grâce à un
        chiffrement asymétrique de bout en bout (E2EE), les réquisitions transmises ne sont à aucun
        moment déchiffrées sur les serveurs de LexaSafe.
      </p>

      <h2>3. Engagements de Service &amp; Disponibilité (SLA)</h2>
      <p>
        Pour les souscriptions Entreprise &amp; Grand Compte, LexaSafe garantit un taux de disponibilité
        mensuel de <strong>99,99%</strong> de son infrastructure hébergée sur les serveurs SecNumCloud
        d&apos;OVHcloud en France.
      </p>

      <h2>4. Responsabilité &amp; Prévention des Fausses Réquisitions</h2>
      <p>
        LexaSafe met en œuvre des mécanismes d&apos;authentification forte (contrôle des domaines
        institutionnels, PKI Carte Agent, analyse heuristique). Toute fausse réquisition expose son
        auteur aux sanctions pénales prévues par les articles 434-4 et suivants du Code Pénal.
      </p>

      <h2>5. Droit Applicable et Juridiction Compétente</h2>
      <p>
        Les présentes CGU sont soumises exclusivement au <strong>droit français</strong>. Tout litige
        relatif à leur validité, interprétation ou exécution sera de la compétence exclusive des
        tribunaux du ressort de Paris.
      </p>
    </LegalPageLayout>
  );
}
