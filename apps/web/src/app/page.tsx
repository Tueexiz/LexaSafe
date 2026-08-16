import dynamic from "next/dynamic";
import { WebHeader } from "@/components/WebHeader";
import { HeroSection } from "@/components/HeroSection";
import { HeroTitle } from "@/components/HeroTitle";
import { HomeShell } from "@/components/HomeShell";
import { CreatorsSection } from "@/components/CreatorsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { FaqSection } from "@/components/FaqSection";
import { getMessages } from "@/i18n/server";

const WorkflowSection = dynamic(() =>
  import("@/components/Sections").then((mod) => ({ default: mod.WorkflowSection }))
);

const AdvantagesSection = dynamic(() =>
  import("@/components/Sections").then((mod) => ({ default: mod.AdvantagesSection }))
);

const DangersSection = dynamic(() =>
  import("@/components/DangersSection").then((mod) => ({ default: mod.DangersSection }))
);

const CalculatorSection = dynamic(() =>
  import("@/components/CalculatorSection").then((mod) => ({ default: mod.CalculatorSection }))
);

const PricingSection = dynamic(() =>
  import("@/components/PricingSection").then((mod) => ({ default: mod.PricingSection }))
);

export default async function HomePage() {
  const { t } = await getMessages();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <HomeShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <WebHeader />
      <main className="relative z-10">
        <HeroSection title={<HeroTitle />} />
        <WorkflowSection />
        <AdvantagesSection />
        <DangersSection />
        <CalculatorSection />
        <PricingSection />
        <CreatorsSection />
        <FaqSection />
      </main>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </HomeShell>
  );
}
