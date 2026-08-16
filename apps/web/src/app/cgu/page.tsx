import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | LexaSafe France",
  description:
    "Conditions générales d'utilisation de la passerelle souveraine LexaSafe : accès, comptes, SLA, responsabilités et droit applicable.",
};

export default function CguPage() {
  return (
    <LegalPageLayout
      badge="Cadre contractuel"
      title="Conditions Générales d'Utilisation"
      subtitle="Dernière mise à jour : 16 août 2026. Les présentes CGU s'appliquent au site vitrine et, le cas échéant, à la plateforme LexaSafe."
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d&apos;utilisation (CGU) ont pour objet de définir les
        modalités d&apos;accès et d&apos;utilisation du site public LexaSafe et de la passerelle
        sécurisée de traitement des réquisitions judiciaires (ci-après la « Plateforme »), éditée par
        LexaSafe France.
      </p>
      <p>
        La Plateforme permet, selon le profil de l&apos;utilisateur, de demander un accès entreprise,
        de solliciter un devis, ou de déposer une demande de compte officier de police judiciaire
        (OPJ), sous réserve des contrôles de sécurité et d&apos;une validation manuelle.
      </p>

      <h2>2. Acceptation</h2>
      <p>
        L&apos;accès au site implique l&apos;acceptation pleine et entière des présentes CGU. La
        création d&apos;un compte ou le dépôt d&apos;une demande d&apos;accès vaut acceptation
        expresse de ces conditions, dans leur version en vigueur au jour de la demande.
      </p>
      <p>
        LexaSafe peut modifier les CGU à tout moment. La version applicable est celle publiée sur cette
        page. En cas de modification substantielle, les utilisateurs disposant d&apos;un compte en
        seront informés par tout moyen utile.
      </p>

      <h2>3. Accès au service</h2>
      <p>
        Le site vitrine est accessible gratuitement. L&apos;accès à la Plateforme est réservé :
      </p>
      <ul>
        <li>
          aux personnes morales (secteur privé ou public) ayant souscrit une offre et dont le compte a
          été validé ;
        </li>
        <li>
          aux officiers de police judiciaire et personnels habilités, après vérification
          d&apos;identité (notamment adresse de messagerie institutionnelle, matricule, unité) et
          validation par un administrateur LexaSafe.
        </li>
      </ul>
      <p>
        LexaSafe se réserve le droit de refuser, suspendre ou clôturer un accès en cas d&apos;information
        inexacte, de suspicion de fraude, d&apos;usurpation d&apos;identité ou de non-respect des
        présentes CGU.
      </p>

      <h2>4. Obligations de l&apos;utilisateur</h2>
      <p>L&apos;utilisateur s&apos;engage à :</p>
      <ul>
        <li>fournir des informations exactes, à jour et sincères lors de toute demande d&apos;accès ;</li>
        <li>préserver la confidentialité de ses identifiants et ne pas les céder à un tiers ;</li>
        <li>
          n&apos;utiliser la Plateforme que dans le cadre de ses missions légitimes (entreprise
          destinataire d&apos;une réquisition, ou autorité compétente) ;
        </li>
        <li>
          ne pas tenter de contourner les mesures de sécurité, d&apos;usurper la qualité d&apos;OPJ ou
          de déposer une fausse réquisition.
        </li>
      </ul>
      <p>
        Toute usurpation de qualité d&apos;officier de police judiciaire ou dépôt d&apos;une fausse
        réquisition est susceptible de poursuites pénales, notamment sur le fondement des articles
        433-17 et 434-4 et suivants du Code pénal.
      </p>

      <h2>5. Architecture « zéro connaissance »</h2>
      <p>
        LexaSafe conçoit la Plateforme selon un principe de chiffrement de bout en bout (E2EE). Les
        contenus des réquisitions transmis via la passerelle ne sont pas destinés à être lus en clair
        par LexaSafe. LexaSafe n&apos;est pas destinataire du fond des pièces échangées entre
        l&apos;autorité requérante et l&apos;organisme requis.
      </p>
      <p>
        Ce principe ne dispense pas l&apos;utilisateur de ses propres obligations légales
        (conservation, secret professionnel, RGPD, Code de procédure pénale).
      </p>

      <h2>6. Disponibilité (SLA)</h2>
      <p>
        LexaSafe s&apos;efforce d&apos;assurer une disponibilité continue du site vitrine. Pour les
        offres Plateforme souscrites, l&apos;objectif de disponibilité de l&apos;infrastructure
        d&apos;ingestion est de <strong>99,99 %</strong> par mois calendaire, hors maintenance
        planifiée, cas de force majeure et défaillances imputables à l&apos;utilisateur ou à un
        opérateur tiers.
      </p>
      <p>
        Les engagements contractuels précis (crédits de service, fenêtres de maintenance, support)
        figurent, le cas échéant, dans le contrat ou le devis accepté par le client.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        LexaSafe met en œuvre des moyens raisonnables de sécurité (authentification, contrôle des
        domaines institutionnels, revue manuelle des demandes). La Plateforme est un outil
        d&apos;acheminement et d&apos;horodatage ; elle ne se substitue pas aux obligations de
        l&apos;entreprise ni à celles de l&apos;autorité judiciaire.
      </p>
      <p>
        LexaSafe ne saurait être tenue responsable des dommages résultant d&apos;une utilisation non
        conforme, d&apos;informations erronées fournies par l&apos;utilisateur, d&apos;une interruption
        du réseau Internet, ou d&apos;un cas de force majeure.
      </p>

      <h2>8. Propriété intellectuelle</h2>
      <p>
        L&apos;utilisation de la Plateforme n&apos;emporte aucun transfert de droits de propriété
        intellectuelle au bénéfice de l&apos;utilisateur, hors le droit d&apos;usage personnel et
        non exclusif nécessaire à l&apos;exécution du service.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans la{" "}
        <a href="/politique-confidentialite">politique de confidentialité</a> et la{" "}
        <a href="/cookies">politique cookies</a>.
      </p>

      <h2>10. Droit applicable et litiges</h2>
      <p>
        Les présentes CGU sont régies par le <strong>droit français</strong>. À défaut d&apos;accord
        amiable, les tribunaux compétents du ressort de Paris seront seuls compétents, sous réserve des
        règles d&apos;ordre public applicables aux consommateurs, le cas échéant.
      </p>
    </LegalPageLayout>
  );
}
