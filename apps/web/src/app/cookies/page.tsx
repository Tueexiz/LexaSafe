import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique des Cookies | LexaSafe France",
  description:
    "Politique cookies LexaSafe : absence de traceurs publicitaires, cookies techniques de session et de sécurité uniquement.",
};

export default function CookiesPage() {
  return (
    <LegalPageLayout
      badge="Traceurs · Lignes directrices CNIL"
      title="Politique des Cookies"
      subtitle="Dernière mise à jour : 16 août 2026. LexaSafe n'utilise pas de cookies publicitaires, de mesure d'audience non exemptée, ni de traceurs de réseaux sociaux."
    >
      <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
      <p>
        Un cookie est un petit fichier déposé sur votre terminal lors de la visite d&apos;un site. Il
        peut permettre le fonctionnement du service, la sécurité, ou — sur d&apos;autres sites — la
        publicité et le suivi. LexaSafe n&apos;emploie pas ces derniers usages.
      </p>

      <h2>2. Notre position</h2>
      <p>
        Le site vitrine et la Plateforme <strong>ne déposent aucun cookie publicitaire, aucun cookie
        de ciblage comportemental, ni aucun traceur tiers</strong> de type Google Analytics, Meta
        Pixel ou équivalent.
      </p>
      <p>
        Aucun bandeau de consentement n&apos;est affiché pour des traceurs marketing, faute de tels
        traceurs.
      </p>

      <h2>3. Cookies et stockage strictement nécessaires</h2>
      <p>
        Seuls des mécanismes techniques indispensables à la fourniture du service d&apos;authentification
        et à la sécurité peuvent être utilisés sur les espaces connectés :
      </p>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Durée</th>
            <th>Finalité</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>__Host-lexasession</code>
            </td>
            <td>Session / courte durée</td>
            <td>Session authentifiée (HttpOnly, Secure, SameSite=Strict)</td>
          </tr>
          <tr>
            <td>
              <code>__Host-csrf-token</code>
            </td>
            <td>Session</td>
            <td>Protection contre les requêtes forgées (CSRF)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Conformément aux lignes directrices de la CNIL, ces traceurs strictement nécessaires au
        service demandé par l&apos;utilisateur sont exemptés de consentement préalable.
      </p>

      <h2>4. Paramétrage du navigateur</h2>
      <p>
        Vous pouvez bloquer les cookies dans les réglages de votre navigateur. Le site vitrine reste
        consultable. En revanche, le blocage des cookies techniques rendra impossible la connexion aux
        espaces sécurisés (portail entreprise ou OPJ).
      </p>

      <h2>5. Contact</h2>
      <p>
        Pour toute question relative aux cookies ou à vos données :{" "}
        <a href="mailto:contact@lexasafe.fr">contact@lexasafe.fr</a>. La politique de confidentialité
        complète est disponible <a href="/politique-confidentialite">ici</a>.
      </p>
    </LegalPageLayout>
  );
}
