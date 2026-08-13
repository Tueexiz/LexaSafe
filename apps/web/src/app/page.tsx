import dynamic from "next/dynamic";
import { AmbientBackground } from "@lexasafe/ui";
import { FadeUp } from "@lexasafe/motion";
import faqData from "@/content/faq.json";
import { WebHeader } from "@/components/WebHeader";
import { HeroSection } from "@/components/HeroSection";
import { WorkflowSection, AdvantagesSection } from "@/components/Sections";
import { SiteFooter } from "@/components/SiteFooter";

const DangersSection = dynamic(() =>
  import("@/components/DangersSection").then((mod) => ({ default: mod.DangersSection }))
);
const CalculatorSection = dynamic(() =>
  import("@/components/CalculatorSection").then((mod) => ({ default: mod.CalculatorSection }))
);
const PricingSection = dynamic(() =>
  import("@/components/PricingSection").then((mod) => ({ default: mod.PricingSection }))
);
const CreatorsSection = dynamic(() =>
  import("@/components/CreatorsSection").then((mod) => ({ default: mod.CreatorsSection }))
);
const FAQAccordion = dynamic(() =>
  import("@lexasafe/ui").then((mod) => ({ default: mod.FAQAccordion }))
);

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AmbientBackground />
      <WebHeader />
      <main className="relative z-10">
        <HeroSection />
        <WorkflowSection />
        <AdvantagesSection />
        <DangersSection />
        <CalculatorSection />
        <PricingSection />
        <CreatorsSection />
        <section className="border-t border-border-subtle bg-bg-subtle py-24" id="faq">
          <div className="container mx-auto max-w-6xl px-6">
            <FadeUp>
              <div className="mx-auto mb-16 max-w-3xl text-center">
                <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
                  Questions Fréquentes
                </span>
                <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">
                  Tout Savoir sur LexaSafe
                </h2>
              </div>
            </FadeUp>
            <FAQAccordion items={faqData} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
