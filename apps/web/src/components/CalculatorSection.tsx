"use client";

import { useMemo, useState } from "react";
import { Timer, Scale } from "lucide-react";
import { AnimatedNumber, FadeUp } from "@lexasafe/motion";
import { computeCalculator, formatEur } from "@/lib/calculator";

const SLIDER_FILL = "#1d4ed8";
const SLIDER_TRACK = "#e2e8f0";

function sliderFillStyle(value: number, min: number, max: number) {
  const percentage = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, ${SLIDER_FILL} 0%, ${SLIDER_FILL} ${percentage}%, ${SLIDER_TRACK} ${percentage}%, ${SLIDER_TRACK} 100%)`,
  };
}

const sliderClassName =
  "h-2 w-full cursor-pointer appearance-none rounded-pill outline-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-primary [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(29,78,216,0.4)] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-primary [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(29,78,216,0.4)]";

export function CalculatorSection() {
  const [revenueM, setRevenueM] = useState(15);
  const [volume, setVolume] = useState(40);

  const result = useMemo(
    () => computeCalculator({ revenueMillionsEur: revenueM, annualVolume: volume }),
    [revenueM, volume]
  );

  const tier1Capped =
    result.rgpdTier1LegalMaxEur > result.rgpdTier1PercentFineEur;
  const tier2Capped =
    result.rgpdTier2LegalMaxEur > result.rgpdTier2PercentFineEur;

  return (
    <section className="border-t border-border-subtle bg-white py-24" id="calculator">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Simulateur d&apos;Impact
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">
              Mesurez votre Gain de Temps &amp; le Risque Évité
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Calculs basés sur le <strong>RGPD Art. 83</strong>, le <strong>CPP Art. 60-1</strong> et le{" "}
              <strong>Règlement e-Evidence</strong> (délai urgence 8 h).
            </p>
          </div>
        </FadeUp>

        <FadeUp index={1}>
          <div className="overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br from-blue-navy to-blue-primary shadow-card">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="space-y-8 bg-white/95 p-8 backdrop-blur-sm">
                <div>
                  <div className="mb-3 flex justify-between text-sm font-semibold">
                    <span>Chiffre d&apos;Affaires Annuel Mondial</span>
                    <span className="text-blue-primary">{result.revenueDisplay}</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={250}
                    step={1}
                    value={revenueM}
                    onChange={(e) => setRevenueM(Number(e.target.value))}
                    style={sliderFillStyle(revenueM, 2, 250)}
                    className={sliderClassName}
                    aria-label="Chiffre d'affaires"
                  />
                  <div className="mt-1 flex justify-between text-xs text-text-muted">
                    <span>2 M€ (PME)</span>
                    <span>50 M€ (ETI)</span>
                    <span>250 M€ (Grand Compte)</span>
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex justify-between text-sm font-semibold">
                    <span>Volume Annuel de Réquisitions</span>
                    <span className="text-blue-primary">{result.volumeDisplay}</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={300}
                    step={5}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    style={sliderFillStyle(volume, 5, 300)}
                    className={sliderClassName}
                    aria-label="Volume réquisitions"
                  />
                </div>
                <div className="rounded-xl border border-border-subtle bg-bg-main p-5 text-sm text-text-secondary">
                  <div className="mb-3 flex items-center gap-2 font-bold text-blue-navy">
                    <Timer className="h-4 w-4 text-blue-primary" />
                    Délais d&apos;instruction (sources légales)
                  </div>
                  <div className="space-y-2 border-b border-dashed border-border-subtle pb-3">
                    <div className="flex justify-between gap-4">
                      <span>Urgences e-Evidence (8 h max)</span>
                      <span>
                        <span className="text-text-muted line-through">{result.urgentManualLabel}</span>
                        {" → "}
                        <strong className="text-emerald-valid">{result.urgentLexaSafeLabel}</strong>
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Dossiers complexes (~2 sem. manuel)</span>
                      <span>
                        <span className="text-text-muted line-through">{result.complexManualLabel}</span>
                        {" → "}
                        <strong className="text-emerald-valid">{result.complexLexaSafeLabel}</strong>
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-text-muted">
                    Économie moyenne : 4,5 h → 34 min par réquisition standard (juriste/DPO @ 85 €/h chargé).
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center p-8 text-white">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-border">
                  <Scale className="h-4 w-4" />
                  Exposition RGPD Art. 83(4) — 2 % du CA mondial
                </div>
                <div className="my-3 font-display text-5xl font-extrabold">
                  <AnimatedNumber
                    value={result.rgpdTier1PercentFineEur}
                    format={formatEur}
                  />
                </div>
                {tier1Capped && (
                  <p className="mb-2 text-xs text-blue-200">
                    Plafond légal applicable :{" "}
                    <strong>{result.primaryLegalMaxDisplay}</strong> (10 M€ minimum Art. 83(4))
                  </p>
                )}
                <p className="mb-2 text-sm text-red-200">
                  Exposition Art. 83(5) — 4 % du CA :{" "}
                  <strong>
                    <AnimatedNumber
                      value={result.rgpdTier2PercentFineEur}
                      format={formatEur}
                    />
                  </strong>
                  {tier2Capped && (
                    <>
                      {" "}
                      (plafond {result.secondaryLegalMaxDisplay})
                    </>
                  )}
                </p>
                <p className="mb-6 text-xs text-blue-200">
                  + risque CPP Art. 60-1 :{" "}
                  <AnimatedNumber
                    value={result.cppRefusalExposureEur}
                    format={(n) => `${Math.round(n).toLocaleString("fr-FR")} €`}
                  />{" "}
                  cumulé ({volume} × 3 750 € par refus injustifié)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="text-2xl font-bold">
                      <AnimatedNumber
                        value={result.hoursSavedPerYear}
                        format={(n) => `${Math.round(n).toLocaleString("fr-FR")} h`}
                      />
                    </div>
                    <div className="text-xs text-blue-200">Temps juriste &amp; DPO libéré / an</div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="text-2xl font-bold">
                      <AnimatedNumber
                        value={result.costSavedEur}
                        format={(n) => `${Math.round(n).toLocaleString("fr-FR")} €`}
                      />
                    </div>
                    <div className="text-xs text-blue-200">Économies RH directes / an</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
