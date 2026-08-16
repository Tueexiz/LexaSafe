/**
 * Simulateur LexaSafe — bases juridiques et métriques opérationnelles
 *
 * Sources :
 * - RGPD Art. 83(4) : max 10 M€ OU 2 % CA mondial (manquements org./sécurité)
 * - RGPD Art. 83(5) : max 20 M€ OU 4 % CA mondial (traitement illicite, droits, transferts)
 * - CPP Art. 60-1 : amende 3 750 € par refus injustifié de réquisition
 * - Règl. (UE) 2023/1543 (e-Evidence) : délai urgence 8 h pour données électroniques
 * - CNIL / pratiques DPO : 4 à 8 h de traitement manuel par réquisition standard
 */

export const LEGAL = {
  rgpdTier1CapEur: 10_000_000,
  rgpdTier1Rate: 0.02,
  rgpdTier2CapEur: 20_000_000,
  rgpdTier2Rate: 0.04,
  cppRefusalFineEur: 3_750,
  urgencyDeadlineHours: 8,
} as const;

export const OPS = {
  /** Temps manuel moyen : vérif. OPJ, analyse juridique, extraction, scellement, audit */
  manualHoursPerRequisition: 4.5,
  /** Temps automatisé LexaSafe (identification, génération archive, remise scellée) */
  automatedHoursPerRequisition: 0.57,
  /** Urgence e-Evidence : mobilisation manuelle jusqu'au plafond légal */
  manualUrgentHours: 8,
  automatedUrgentHours: 0.07,
  /** Dossier complexe : délai manuel typique ~10 j. ouvrés */
  manualComplexHours: 80,
  automatedComplexHours: 6,
  /** Taux horaire chargé juriste/DPO senior (France, 2025-2026) */
  hourlyRateJuristEur: 85,
} as const;

export interface CalculatorInput {
  revenueMillionsEur: number;
  annualVolume: number;
  urgentShare?: number;
}

export interface CalculatorResult {
  revenueDisplay: string;
  volumeDisplay: string;
  rgpdTier1PercentFineEur: number;
  rgpdTier2PercentFineEur: number;
  rgpdTier1LegalMaxEur: number;
  rgpdTier2LegalMaxEur: number;
  cppRefusalExposureEur: number;
  hoursSavedPerYear: number;
  costSavedEur: number;
  urgentManualLabel: string;
  urgentLexaSafeLabel: string;
  complexManualLabel: string;
  complexLexaSafeLabel: string;
  primaryFineDisplay: string;
  secondaryFineDisplay: string;
  primaryLegalMaxDisplay: string;
  secondaryLegalMaxDisplay: string;
}

export function formatEur(amount: number, locale = "fr-FR"): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    })} M€`;
  }
  return `${Math.round(amount).toLocaleString(locale)} €`;
}

function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 24) return `${h.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} h`;
  const days = h / 8;
  return days >= 5 ? `${Math.round(days / 5)} sem.` : `${Math.round(h)} h`;
}

export function computeCalculator(input: CalculatorInput): CalculatorResult {
  const { revenueMillionsEur, annualVolume, urgentShare = 0.15 } = input;
  const revenueEur = revenueMillionsEur * 1_000_000;

  const rgpdTier1PercentFineEur = revenueEur * LEGAL.rgpdTier1Rate;
  const rgpdTier2PercentFineEur = revenueEur * LEGAL.rgpdTier2Rate;
  const rgpdTier1LegalMaxEur = Math.max(
    LEGAL.rgpdTier1CapEur,
    rgpdTier1PercentFineEur
  );
  const rgpdTier2LegalMaxEur = Math.max(
    LEGAL.rgpdTier2CapEur,
    rgpdTier2PercentFineEur
  );
  const cppRefusalExposureEur = LEGAL.cppRefusalFineEur * annualVolume;

  const savedPerReq =
    OPS.manualHoursPerRequisition - OPS.automatedHoursPerRequisition;
  const urgentSaved =
    (OPS.manualUrgentHours - OPS.automatedUrgentHours) *
    Math.round(annualVolume * urgentShare);
  const standardSaved = savedPerReq * Math.round(annualVolume * (1 - urgentShare));
  const hoursSavedPerYear = Math.round(urgentSaved + standardSaved);
  const costSavedEur = Math.round(hoursSavedPerYear * OPS.hourlyRateJuristEur);

  const revenueDisplay =
    revenueMillionsEur >= 1000
      ? `${(revenueMillionsEur / 1000).toFixed(1)} Md€`
      : `${revenueMillionsEur} M€`;

  return {
    revenueDisplay,
    volumeDisplay: `${annualVolume} / an`,
    rgpdTier1PercentFineEur,
    rgpdTier2PercentFineEur,
    rgpdTier1LegalMaxEur,
    rgpdTier2LegalMaxEur,
    cppRefusalExposureEur,
    hoursSavedPerYear,
    costSavedEur,
    urgentManualLabel: formatHours(OPS.manualUrgentHours),
    urgentLexaSafeLabel: formatHours(OPS.automatedUrgentHours),
    complexManualLabel: formatHours(OPS.manualComplexHours),
    complexLexaSafeLabel: formatHours(OPS.automatedComplexHours),
    primaryFineDisplay: formatEur(rgpdTier1PercentFineEur),
    secondaryFineDisplay: formatEur(rgpdTier2PercentFineEur),
    primaryLegalMaxDisplay: formatEur(rgpdTier1LegalMaxEur),
    secondaryLegalMaxDisplay: formatEur(rgpdTier2LegalMaxEur),
  };
}
