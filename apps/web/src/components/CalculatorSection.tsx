"use client";

import { useMemo, useState } from "react";
import { AnimatedNumber, FadeUp } from "@lexasafe/motion";
import { computeCalculator, formatEur } from "@/lib/calculator";
import { fill, useI18n } from "@/i18n/I18nProvider";

const SLIDER_FILL = "#0259DD";
const SLIDER_TRACK = "rgba(232, 237, 245, 0.9)";

function sliderFillStyle(value: number, min: number, max: number) {
  const percentage = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, ${SLIDER_FILL} 0%, ${SLIDER_FILL} ${percentage}%, ${SLIDER_TRACK} ${percentage}%, ${SLIDER_TRACK} 100%)`,
  };
}

const sliderClassName =
  "h-1.5 w-full cursor-pointer appearance-none rounded-pill outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-primary [&::-moz-range-thumb]:shadow-[0_4px_14px_rgba(2,89,221,0.35)] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-primary [&::-webkit-slider-thumb]:shadow-[0_4px_14px_rgba(2,89,221,0.35)]";

const glassPanel =
  "relative rounded-[2rem] border border-white/70 bg-white/45 shadow-[0_18px_60px_-24px_rgba(132,175,251,0.55)] backdrop-blur-2xl";

export function CalculatorSection() {
  const { locale, t } = useI18n();
  const c = t.calculator;
  const [revenueM, setRevenueM] = useState(15);
  const [volume, setVolume] = useState(40);
  const numberLocale = locale === "en" ? "en-GB" : "fr-FR";

  const result = useMemo(
    () => computeCalculator({ revenueMillionsEur: revenueM, annualVolume: volume }),
    [revenueM, volume]
  );

  const formatMoney = (n: number) => formatEur(n, numberLocale);

  return (
    <section className="relative overflow-hidden py-24" id="calculator">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 18% 30%, rgba(132, 175, 251, 0.28) 0%, transparent 58%),
            radial-gradient(ellipse 60% 50% at 88% 62%, rgba(2, 89, 221, 0.08) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 100%, rgba(255, 255, 255, 0.9) 0%, transparent 70%),
            linear-gradient(180deg, #FFFFFF 0%, #FBF8F4 42%, #F5F9FF 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#84AFFB]/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-white/70 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary shadow-[0_8px_24px_rgba(132,175,251,0.18)] backdrop-blur-md">
              {c.badge}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">{c.title}</h2>
            <p className="mt-4 text-lg text-text-secondary">{c.subtitle}</p>
          </div>
        </FadeUp>

        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
          <FadeUp index={1}>
            <div className={`${glassPanel} p-7 sm:p-9`}>
              <div className="space-y-10">
                <div>
                  <div className="mb-4 flex items-baseline justify-between gap-4 text-sm font-semibold text-blue-navy">
                    <span>{c.revenue}</span>
                    <span className="font-display text-base text-blue-primary">{result.revenueDisplay}</span>
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
                    aria-label={c.revenueAria}
                  />
                  <div className="mt-2 flex justify-between text-[11px] text-text-muted">
                    <span>2 M€ · {c.sme}</span>
                    <span>50 M€ · {c.mid}</span>
                    <span>250 M€ · {c.large}</span>
                  </div>
                </div>
                <div>
                  <div className="mb-4 flex items-baseline justify-between gap-4 text-sm font-semibold text-blue-navy">
                    <span>{c.volume}</span>
                    <span className="font-display text-base text-blue-primary">
                      {volume} / {locale === "en" ? "year" : "an"}
                    </span>
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
                    aria-label={c.volumeAria}
                  />
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp index={2}>
            <div className="relative md:-translate-y-2">
              <div
                className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[#84AFFB]/20 blur-3xl"
                aria-hidden="true"
              />
              <div className={`${glassPanel} relative bg-white/55 p-7 sm:p-9`}>
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-primary/80">{c.fineLabel}</p>
                <p className="mt-1 text-sm text-text-secondary">{c.fineHint}</p>
                <div className="mt-3 font-display text-5xl font-extrabold tracking-tight text-blue-navy md:text-[3.25rem]">
                  <AnimatedNumber value={result.rgpdTier1PercentFineEur} format={formatMoney} />
                </div>
                <p className="mt-4 text-sm text-crimson-threat/90">
                  {fill(c.severe, { amount: formatMoney(result.rgpdTier2PercentFineEur) })}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  {fill(c.refusal, {
                    amount: `${Math.round(result.cppRefusalExposureEur).toLocaleString(numberLocale)} €`,
                  })}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-[1.5rem] border border-white/80 bg-white/55 px-5 py-3 shadow-[0_8px_24px_rgba(132,175,251,0.16)] backdrop-blur-md">
                    <div className="font-display text-lg font-bold leading-none text-blue-navy">
                      <AnimatedNumber
                        value={result.hoursSavedPerYear}
                        format={(n) => `${Math.round(n).toLocaleString(numberLocale)} h`}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-text-secondary">{c.hours}</div>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/80 bg-white/55 px-5 py-3 shadow-[0_8px_24px_rgba(132,175,251,0.16)] backdrop-blur-md">
                    <div className="font-display text-lg font-bold leading-none text-blue-navy">
                      <AnimatedNumber
                        value={result.costSavedEur}
                        format={(n) => `${Math.round(n).toLocaleString(numberLocale)} €`}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-text-secondary">{c.savings}</div>
                  </div>
                </div>
                <p className="mt-5 text-[11px] text-text-muted">{c.footnote}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
