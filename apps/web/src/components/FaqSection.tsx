import { FadeUp } from "@lexasafe/motion";
import { FAQAccordion } from "@lexasafe/ui";
import { getMessages } from "@/i18n/server";

export async function FaqSection() {
  const { t } = await getMessages();

  return (
    <section className="border-t border-border-subtle bg-bg-subtle py-24" id="faq">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-pill border border-blue-border bg-bg-blue-tint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-primary">
              {t.faq.badge}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">{t.faq.title}</h2>
          </div>
        </FadeUp>
        <FAQAccordion items={[...t.faq.items]} />
      </div>
    </section>
  );
}
