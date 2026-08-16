import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import type { CategorySeo } from "@/lib/categories";
import { itemListJsonLd } from "@/lib/seo";
import type { Product } from "@/lib/types";

export function CategoryView({
  category,
  products,
}: {
  category: CategorySeo;
  products: Product[];
}) {
  const path = `/catalog/${category.slug}`;

  return (
    <div className="container-page py-12 md:py-16">
      <JsonLd data={itemListJsonLd(category.h1, path, products)} />
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/catalog" },
          { name: category.label },
        ]}
      />

      <header className="mb-12 max-w-3xl">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
          {category.label}
        </p>
        <h1 className="display mt-3 text-[clamp(2rem,4.5vw,3.2rem)] tracking-[-0.04em] normal-case">
          {category.h1}
        </h1>
        <p className="mt-4 text-ink-muted leading-relaxed">{category.intro}</p>
      </header>

      <CatalogBrowser
        products={products}
        basePath={path}
        filterCurrent={{
          category: category.id,
          audience: "women",
        }}
      >
        <div className="mt-14 max-w-3xl text-sm leading-relaxed text-ink-muted">
          <h2 className="text-lg font-semibold text-ink tracking-tight">
            О категории
          </h2>
          <p className="mt-3">{category.seoText}</p>
          <p className="mt-4">
            Смотрите также:{" "}
            <Link href="/size-guide" className="underline underline-offset-4 text-ink">
              таблица размеров
            </Link>
            {", "}
            <Link href="/delivery" className="underline underline-offset-4 text-ink">
              доставка и оплата
            </Link>
            {", "}
            <Link href="/lookbook" className="underline underline-offset-4 text-ink">
              lookbook
            </Link>
            .
          </p>
        </div>

        <FaqSection items={category.faq} />
      </CatalogBrowser>
    </div>
  );
}
