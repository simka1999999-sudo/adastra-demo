"use client";

import { Suspense, useEffect, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { ProductCard } from "@/components/catalog/ProductCard";
import { categories, getCategoryPath } from "@/lib/categories";
import { applyFacets } from "@/lib/products";
import type { Product } from "@/lib/types";

type FilterCurrent = ComponentProps<typeof CatalogFilters>["current"];

type Props = {
  products: Product[];
  basePath: string;
  filterCurrent: FilterCurrent;
  /** Старые ссылки /catalog?category=overalls → ЧПУ */
  redirectLegacyCategory?: boolean;
  children?: ReactNode;
};

function CatalogResults({
  products,
  basePath,
  filterCurrent,
  facets,
  children,
}: Props & {
  facets: {
    color?: string;
    size?: string;
    sort?: "price_asc" | "price_desc";
    collection?: string;
  };
}) {
  const list = applyFacets(products, facets);

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start md:gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
      <CatalogFilters
        current={{
          ...filterCurrent,
          color: facets.color,
          size: facets.size,
          sort: facets.sort,
          collection: facets.collection,
        }}
        basePath={basePath}
      />
      <div>
        <p className="mb-4 text-sm text-ink-muted">Найдено: {list.length}</p>
        {list.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-ink-muted">
            По выбранным фильтрам ничего не найдено.{" "}
            <Link href={basePath} className="underline underline-offset-4">
              Сбросить фильтры
            </Link>
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

function CatalogBrowserInner(props: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const categoryParam = sp.get("category");

  useEffect(() => {
    if (!props.redirectLegacyCategory || !categoryParam) return;
    const match = categories.find((c) => c.id === categoryParam);
    if (match) router.replace(getCategoryPath(match.id));
  }, [categoryParam, props.redirectLegacyCategory, router]);

  const sortRaw = sp.get("sort");
  const sort =
    sortRaw === "price_asc" || sortRaw === "price_desc" ? sortRaw : undefined;

  return (
    <CatalogResults
      {...props}
      facets={{
        color: sp.get("color") || undefined,
        size: sp.get("size") || undefined,
        sort,
        collection: sp.get("collection") || undefined,
      }}
    />
  );
}

export function CatalogBrowser(props: Props) {
  return (
    <Suspense
      fallback={
        <CatalogResults {...props} facets={{}} />
      }
    >
      <CatalogBrowserInner {...props} />
    </Suspense>
  );
}
