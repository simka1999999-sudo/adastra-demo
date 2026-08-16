import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ozonReviews, ozonReviewsMeta } from "../../../content/reviews";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Отзывы покупателей ADASTRA на Ozon",
  description:
    "Отзывы о комбинезонах ADASTRA: город, поездки, горы и прогулки. Тысячи оценок на Ozon.",
  path: "/reviews",
});

export default function ReviewsPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Утеплённые комбинезоны ADASTRA",
    brand: { "@type": "Brand", name: "ADASTRA" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ozonReviewsMeta.averageRating,
      reviewCount: ozonReviewsMeta.reviewsCountApprox,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <div className="container-page py-10 md:py-14">
      <JsonLd data={ld} />
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Отзывы" },
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
          Ozon
        </p>
        <h1 className="display mt-3 text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Отзывы покупателей
        </h1>
        <p className="mt-4 text-ink-muted">
          {ozonReviewsMeta.totalLabel}. Средняя оценка{" "}
          {ozonReviewsMeta.averageRating} из 5.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {ozonReviews.map((r) => (
          <blockquote
            key={r.id}
            className="border border-line bg-bg-elevated p-6"
          >
            <p className="text-sm font-semibold tracking-[0.12em] uppercase">
              {"★".repeat(r.rating)}
              <span className="text-ink-muted">
                {"☆".repeat(5 - r.rating)}
              </span>
            </p>
            <p className="mt-4 text-base leading-relaxed">«{r.text}»</p>
            <footer className="mt-4 text-sm text-ink-muted">
              {r.author}
              {r.context ? ` · ${r.context}` : ""}
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <a
          href={siteConfig.ozonShopUrl}
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          Отзывы на Ozon
        </a>
        <Link href="/catalog/kombinezony" className="btn btn-ghost">
          В каталог
        </Link>
      </div>
    </div>
  );
}
