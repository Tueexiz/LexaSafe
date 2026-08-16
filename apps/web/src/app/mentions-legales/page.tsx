import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Mentions Légales | LexaSafe France",
  description:
    "Mentions légales de LexaSafe France : éditeur, hébergeur OVHcloud, directeur de la publication et propriété intellectuelle (LCEN).",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout
      badge="Loi pour la Confiance dans l'Économie Numérique"
      title="Mentions Légales"
      subtitle="Informations prévues par les articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 (LCEN)."
    >
      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>lexasafe.fr</strong> et la plateforme associée sont édités par{" "}
        <strong>LexaSafe France</strong>, société par actions simplifiée en cours de constitution
        (ci-après « LexaSafe »).
      </p>
      <p>
        <strong>Forme juridique :</strong> SAS en cours d&apos;immatriculation
        <br />
        <strong>Président :</strong> Tueexiz
        <br />
        <strong>Directeur de la cybersécurité :</strong> 0xzEus
        <br />
        <strong>Contact :</strong>{" "}
        <a href="mailto:contact@lexasafe.fr">contact@lexasafe.fr</a>
      </p>
      <p>
        Les numéros d&apos;immatriculation (RCS, SIREN, TVA intracommunautaire) et l&apos;adresse du
        siège social seront publiés sur cette page dès l&apos;immatriculation de la société au registre
        du commerce et des sociétés.
      </p>

      <h2>2. Directeur de la publication</h2>
      <p>
        Le directeur de la publication est <strong>Tueexiz</strong>, en qualité de Président de
        LexaSafe France.
      </p>

      <h2>3. Hébergement</h2>
      <p>
        L&apos;infrastructure de production (site vitrine, applications, bases de données et services
        de chiffrement) est hébergée exclusivement en France par :
      </p>
      <p>
        <strong>OVHcloud SAS</strong>
        <br />
        2 rue Kellermann — 59100 Roubaix — France
        <br />
        <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">
          www.ovhcloud.com
        </a>
      </p>
      <p>
        Les environnements visés sont opérés sur des datacenters français, dans une logique de
        souveraineté numérique (qualification SecNumCloud ANSSI visée pour la plateforme de production).
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments du site et de la plateforme (marque, dénomination, logos, charte
        graphique, textes, visuels, architecture logicielle, code source, bases de données) est
        protégé par le Code de la propriété intellectuelle et reste la propriété exclusive de LexaSafe,
        sauf mention contraire.
      </p>
      <p>
        Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans
        autorisation écrite préalable de LexaSafe, est interdite et constitue une contrefaçon au sens
        des articles L.335-2 et suivants du Code de la propriété intellectuelle.
      </p>

      <h2>5. Crédits</h2>
      <p>
        Conception et développement : LexaSafe France (Tueexiz &amp; 0xzEus).
        <br />
        Photographies et illustrations des fondateurs : propriété des personnes représentées, utilisées
        avec leur autorisation.
      </p>

      <h2>6. Contact</h2>
      <p>
        Pour toute question relative au site, à son contenu ou à l&apos;exercice de vos droits :{" "}
        <a href="mailto:contact@lexasafe.fr">contact@lexasafe.fr</a>.
      </p>
    </LegalPageLayout>
  );
}
