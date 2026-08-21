import "server-only";
import { products as bundled } from "../../content/products";
import { HOME_HIT_SKUS } from "../../content/products/hits";
import { readCatalog } from "@/lib/catalog-store";
import { scopeProducts, type ProductFilters } from "@/lib/products";
import type { Product } from "@/lib/types";

function useBundledCatalog() {
  return (
    process.env.GITHUB_PAGES === "true" ||
    process.env.NEXT_PUBLIC_STATIC_DEMO === "true"
  );
}

export function getAllProducts(): Product[] {
  if (useBundledCatalog()) return bundled;
  try {
    return readCatalog();
  } catch {
    return bundled;
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getFeaturedProducts(limit = 3): Product[] {
  const list = getAllProducts();
  const bySku = new Map(list.map((p) => [p.masterSku, p]));
  const homeHits = HOME_HIT_SKUS.map((sku) => bySku.get(sku)).filter(
    (p): p is Product => Boolean(p?.inStock),
  );
  if (homeHits.length) return homeHits.slice(0, limit);
  const hits = list
    .filter((p) => p.inStock && p.isHit)
    .sort((a, b) => (a.hitRank ?? 99) - (b.hitRank ?? 99));
  if (hits.length) return hits.slice(0, limit);
  return list.filter((p) => p.featured && p.inStock).slice(0, limit);
}

export function getFromPrice(category?: Product["category"]) {
  const prices = getAllProducts()
    .filter((p) => p.inStock && (category ? p.category === category : true))
    .map((p) => p.price);
  return prices.length ? Math.min(...prices) : 0;
}

export function getColorSiblings(product: Product): Product[] {
  if (!product.colorGroup) return [];
  return getAllProducts().filter(
    (p) => p.inStock && p.colorGroup === product.colorGroup && p.id !== product.id,
  );
}

export function filterProducts(filters: ProductFilters = {}): Product[] {
  return scopeProducts(getAllProducts(), filters);
}
