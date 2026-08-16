import "server-only";
import { products as bundled } from "../../content/products";
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

export function getFeaturedProducts(): Product[] {
  const list = getAllProducts();
  const hits = list
    .filter((p) => p.inStock && p.isHit)
    .sort((a, b) => (a.hitRank ?? 99) - (b.hitRank ?? 99));
  if (hits.length) return hits;
  return list.filter((p) => p.featured && p.inStock).slice(0, 6);
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
