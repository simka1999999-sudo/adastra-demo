import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { filterProducts } from "@/lib/products";
import { buildPageMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Каталог утеплённой одежды — купить онлайн",
  description:
    "Каталог женских утеплённых комбинезонов, курток, пальто и брюк ADASTRA. Фильтры по размеру и цвету, доставка по России.",
  path: "/catalog",
  follow: true,
});

export default function CatalogPage() {
  const list = filterProducts({});

  return (
    <div className="container-page py-12 md:py-16">
      <JsonLd data={itemListJsonLd("Каталог ADASTRA", "/catalog", list)} />
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Каталог" },
        ]}
      />

      <header className="mb-12 max-w-2xl">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
          Shop
        </p>
        <h1 className="display mt-3 text-[clamp(2.4rem,5vw,3.6rem)] tracking-[-0.04em]">
          Каталог
        </h1>
        <p className="mt-4 text-ink-muted">
          Утеплённая одежда ADASTRA: комбинезоны, куртки, пальто и брюки.
        </p>
      </header>

      <CatalogBrowser
        products={list}
        basePath="/catalog"
        filterCurrent={{}}
        redirectLegacyCategory
      />
    </div>
  );
}
