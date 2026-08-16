import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique des Cookies | LexaSafe France",
  description:
    "Politique cookies LexaSafe : zéro traceur publicitaire tiers, cookies strictement techniques uniquement.",
};

export default function CookiesPage() {
  return (
    <LegalPageLayout
      badge="Zéro Tracker Publicitaire"
      title="Politique des Cookies"
      subtitle="Aucun traceur tiers (Google Analytics, Meta Pixel) n'est injecté sur LexaSafe."
    >
      <h2>1. Notre Engagement : Zéro Traceur Tiers</h2>
      <p>
        LexaSafe ne dépose <strong>aucun cookie publicitaire, aucun cookie de ciblage
        comportemental, ni aucun tracker tiers américain</strong> sur votre terminal.
      </p>

      <h2>2. Cookies Strictement Nécessaires</h2>
      <p>
        Les seuls cookies utilisés sont <strong>strictement techniques et indispensables</strong> à la
        sécurité des opérations :
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
            <td>30 minutes</td>
            <td>Session chiffrée JWE (HttpOnly, Secure, SameSite=Strict)</td>
          </tr>
          <tr>
            <td>
              <code>__Host-csrf-token</code>
            </td>
            <td>Session</td>
            <td>Jeton anti-CSRF</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Gestion de vos Préférences</h2>
      <p>
        Conformément aux lignes directrices CNIL, ces cookies techniques ne requièrent pas de
        consentement préalable. Vous pouvez configurer votre navigateur pour les bloquer, mais
        l&apos;accès aux portails sécurisés sera alors impossible.
      </p>
    </LegalPageLayout>
  );
}
