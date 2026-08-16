import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartForm } from "@/components/catalog/AddToCartForm";
import { CategoryView } from "@/components/catalog/CategoryView";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductTrust } from "@/components/catalog/ProductTrust";
import { ChipLink } from "@/components/ui/Chip";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ProductViewTracker } from "@/components/seo/ProductViewTracker";
import { JsonLd } from "@/components/JsonLd";
import {
  getCategoryById,
  getCategoryBySlug,
  getCategoryPath,
  allCategorySlugs,
} from "@/lib/categories";
import { categoryLabels, productImageAlt, storefrontImages } from "@/lib/products";
import {
  filterProducts,
  getColorSiblings,
  getProductBySlug,
  getAllProducts,
} from "@/lib/catalog-query";
import {
  buildPageMetadata,
  productJsonLd,
} from "@/lib/seo";
import {
  CARE_PLACEHOLDER,
  DESCRIPTION_PLACEHOLDER,
  displaySpec,
  isPlaceholderSpec,
  SPEC_PLACEHOLDER,
} from "@/lib/catalog-defaults";

type Props = {
  params: Promise<{ slug: string }>;
};

function SpecRow({ label, value }: { label: string; value?: string }) {
  const text = displaySpec(value);
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={isPlaceholderSpec(value) ? "text-ink-muted" : undefined}>{text}</dd>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    ...allCategorySlugs().map((slug) => ({ slug })),
    ...getAllProducts().map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (category) {
    return buildPageMetadata({
      title: category.title,
      description: category.description,
      path: `/catalog/${category.slug}`,
      image: category.ogImage,
      follow: true,
    });
  }

  const product = getProductBySlug(slug);
  if (!product) return {};
  const cover = storefrontImages(product)[0];

  return buildPageMetadata({
    title: product.seo.title,
    description: product.seo.description,
    path: `/catalog/${product.slug}`,
    image: cover,
  });
}

export default async function CatalogSlugPage({ params }: Props) {
  const { slug } = await params;

  const category = getCategoryBySlug(slug);
  if (category) {
    const list = filterProducts({
      category: category.id,
      audience: "women",
    });

    return <CategoryView category={category} products={list} />;
  }

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => (a.hitRank ?? 99) - (b.hitRank ?? 99))
    .slice(0, 3);
  const colorSiblings = getColorSiblings(product);
  const cat = getCategoryById(product.category);
  const photos = storefrontImages(product);
  const colorLabel = product.colors.filter(Boolean).join(", ");

  return (
    <div className="container-page py-10 md:py-14">
      <ProductViewTracker product={product} />
      <JsonLd data={productJsonLd(product)} />
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/catalog" },
          {
            name: categoryLabels[product.category],
            path: getCategoryPath(product.category),
          },
          { name: product.shortTitle },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={photos}
          alt={productImageAlt(product)}
        />
        <div>
          <p className="text-[0.72rem] tracking-[0.14em] uppercase text-ink-muted">
            {categoryLabels[product.category]} · {product.collection}
            {product.masterSku ? ` · ${product.masterSku}` : ""}
          </p>
          {product.isHit || product.isNew ? (
            <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.16em] uppercase text-frost-deep">
              {product.isHit ? "Хит" : "Новинка"}
            </p>
          ) : null}
          <h1 className="display mt-3 text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.03em] normal-case">
            {product.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            {isPlaceholderSpec(product.description)
              ? DESCRIPTION_PLACEHOLDER
              : product.description}
          </p>
          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>
          {colorSiblings.length ? (
            <div className="mt-6">
              <p className="label">В этой линейке</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                <li>
                  <span className="chip chip-active">{product.shortTitle}</span>
                </li>
                {colorSiblings.map((sibling) => (
                  <li key={sibling.id}>
                    <ChipLink href={`/catalog/${sibling.slug}`}>
                      {sibling.shortTitle}
                    </ChipLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <ProductTrust />
          <dl className="mt-10 grid gap-3 border-t border-line pt-8 text-sm">
            <SpecRow label="Артикул" value={product.masterSku || product.id} />
            <SpecRow label="Цвет" value={colorLabel} />
            <SpecRow label="Сезон" value={product.season} />
            <SpecRow label="Материалы" value={product.materials} />
            <SpecRow label="Утеплитель" value={product.insulation} />
            <SpecRow label="Температура" value={product.temperature} />
            <SpecRow label="Страна" value={product.country} />
            <SpecRow label="Уход" value={product.care || CARE_PLACEHOLDER} />
          </dl>
          <ul className="mt-8 space-y-2 text-sm text-ink-muted">
            {(product.features.length ? product.features : [SPEC_PLACEHOLDER]).map((f) => (
              <li key={f}>— {f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-1.5">
            <ChipLink href="/size-guide">Как выбрать размер</ChipLink>
            <ChipLink href="/delivery">Доставка и оплата</ChipLink>
            <ChipLink href="/returns">Возврат</ChipLink>
            {cat ? (
              <ChipLink href={getCategoryPath(product.category)}>
                Все {cat.label.toLowerCase()}
              </ChipLink>
            ) : null}
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="mt-20">
          <h2 className="display mb-8 text-[clamp(1.6rem,3vw,2.2rem)] tracking-[-0.03em]">
            Также из категории
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
