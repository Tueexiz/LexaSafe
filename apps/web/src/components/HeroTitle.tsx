import { getLocale } from "@/i18n/server";
import { messages } from "@/i18n/messages";

export async function HeroTitle() {
  const locale = await getLocale();
  const { lines, aria } = messages[locale].hero;
  let charIndex = 0;

  return (
    <h1
      className="hero-title font-[family-name:var(--font-syne)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-blue-navy [font-size:clamp(2rem,6.5vw,5.5rem)]"
      aria-label={aria}
    >
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {line.words.map((word, i) => {
            const isAccent = line.accent === i;
            return (
              <span
                key={`${word}-${i}`}
                className={`hero-title-word inline-block overflow-hidden align-bottom ${isAccent ? "text-[#0259DD]" : ""}`}
              >
                {Array.from(word).map((char, ci) => {
                  const delay = `${0.28 + charIndex++ * 0.028}s`;
                  return (
                    <span key={`${char}-${ci}`} className="hero-title-mask inline-block overflow-hidden align-bottom">
                      <span className="hero-title-char inline-block will-change-transform" style={{ animationDelay: delay }}>
                        {char}
                      </span>
                    </span>
                  );
                })}
                {i < line.words.length - 1 ? "\u00A0" : ""}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
