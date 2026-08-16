import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | LexaSafe France",
  description:
    "Politique de confidentialité LexaSafe : responsable de traitement, données collectées, finalités, durées, droits RGPD et réclamation CNIL.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout
      badge="RGPD · Loi Informatique et Libertés"
      title="Politique de Confidentialité"
      subtitle="Dernière mise à jour : 16 août 2026. Traitement des données personnelles conformément au règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 du 6 janvier 1978."
    >
      <h2>1. Responsable de traitement</h2>
      <p>
        Le responsable de traitement est <strong>LexaSafe France</strong> (SAS en cours de
        constitution), joignable à <a href="mailto:contact@lexasafe.fr">contact@lexasafe.fr</a>.
      </p>
      <p>
        Les contenus des réquisitions judiciaires transités via la passerelle, lorsqu&apos;ils sont
        chiffrés de bout en bout, ne sont pas destinés à être accessibles en clair à LexaSafe. Dans
        cette hypothèse, LexaSafe n&apos;agit pas comme destinataire du fond des pièces.
      </p>

      <h2>2. Données collectées</h2>
      <p>Selon le parcours utilisé, LexaSafe peut collecter :</p>
      <ul>
        <li>
          <strong>Site vitrine :</strong> données de connexion techniques strictement nécessaires au
          fonctionnement et à la sécurité (voir la politique cookies) ;
        </li>
        <li>
          <strong>Demande d&apos;accès entreprise :</strong> raison sociale, SIREN/SIRET, secteur
          (privé / public), coordonnées professionnelles (email, téléphone), identité du référent et,
          le cas échéant, pièces justificatives (extrait Kbis, etc.) ;
        </li>
        <li>
          <strong>Demande de compte OPJ :</strong> nom, prénom, adresse de messagerie
          institutionnelle, matricule, unité, grade, téléphone professionnel, références de procédure
          le cas échéant ;
        </li>
        <li>
          <strong>Comptes validés :</strong> identifiants de session, journaux de sécurité
          (horodatage, adresse IP, actions d&apos;authentification).
        </li>
      </ul>
      <p>
        LexaSafe ne collecte pas de données de navigation à des fins publicitaires et n&apos;utilise
        pas de traceurs de ciblage tiers.
      </p>

      <h2>3. Finalités et bases légales</h2>
      <p>Les traitements ont pour finalités :</p>
      <ul>
        <li>
          l&apos;instruction des demandes d&apos;accès et la lutte contre l&apos;usurpation
          (intérêt légitime et, le cas échéant, mesures précontractuelles) ;
        </li>
        <li>la fourniture du service souscrit (exécution du contrat) ;</li>
        <li>
          la sécurité de la Plateforme, la prévention de la fraude et le respect des obligations
          légales (intérêt légitime et obligation légale) ;
        </li>
        <li>la réponse aux demandes adressées à contact@lexasafe.fr (intérêt légitime).</li>
      </ul>

      <h2>4. Destinataires</h2>
      <p>
        Les données sont destinées aux personnels habilités de LexaSafe chargés de la revue des
        demandes, du support et de la sécurité. Elles peuvent être communiquées à l&apos;hébergeur
        OVHcloud SAS (France) en sa qualité de sous-traitant technique, dans le cadre de
        l&apos;hébergement.
      </p>
      <p>
        LexaSafe ne vend pas les données et ne les transfère pas hors de l&apos;Union européenne, sauf
        obligation légale.
      </p>

      <h2>5. Durées de conservation</h2>
      <p>
        Les demandes d&apos;accès refusées ou abandonnées sont conservées le temps nécessaire à la
        lutte contre la fraude et aux éventuelles réclamations, puis supprimées ou archivées sous une
        forme minimisée. Les comptes actifs sont conservés pendant la durée de la relation
        contractuelle, puis pendant les délais de prescription applicables. Les journaux de sécurité
        sont conservés pour une durée proportionnée aux finalités de sécurité.
      </p>
      <p>
        Les métadonnées d&apos;acheminement (horodatage, empreintes, accusés) peuvent être conservées
        plus longtemps lorsqu&apos;une obligation légale de traçabilité l&apos;impose.
      </p>

      <h2>6. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, de limitation, d&apos;opposition, et du droit à la portabilité lorsque
        celui-ci s&apos;applique. Vous pouvez également définir des directives relatives au sort de
        vos données après votre décès.
      </p>
      <p>
        Pour exercer ces droits : <a href="mailto:contact@lexasafe.fr">contact@lexasafe.fr</a>. Une
        pièce d&apos;identité pourra être demandée en cas de doute raisonnable sur l&apos;identité du
        demandeur.
      </p>
      <p>
        Lorsque l&apos;effacement est possible, LexaSafe applique des mesures techniques visant à
        rendre les données inexploitables (y compris, le cas échéant, la destruction des clés
        associées).
      </p>

      <h2>7. Réclamation</h2>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
        auprès de la Commission nationale de l&apos;informatique et des libertés (CNIL) — 3 Place de
        Fontenoy, TSA 80715, 75334 Paris Cedex 07 —{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        .
      </p>
    </LegalPageLayout>
  );
}
