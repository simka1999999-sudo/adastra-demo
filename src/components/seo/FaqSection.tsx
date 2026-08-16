import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import type { FaqItem } from "../../../content/seo/categories";

export function FaqSection({
  title = "Частые вопросы",
  items,
}: {
  title?: string;
  items: FaqItem[];
}) {
  if (!items.length) return null;
  const ld = faqJsonLd(items);

  return (
    <section className="mt-16 border-t border-line pt-12">
      {ld ? <JsonLd data={ld} /> : null}
      <h2 className="display text-[clamp(1.6rem,3vw,2.2rem)] tracking-[-0.03em]">
        {title}
      </h2>
      <dl className="mt-8 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="text-base font-semibold tracking-tight">
              {item.question}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
