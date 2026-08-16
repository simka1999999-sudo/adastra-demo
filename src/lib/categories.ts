import {
  categories,
  type CategorySeo,
} from "../../content/seo/categories";
import type { Product } from "./types";

export { categories };
export type { CategorySeo };

export function getCategoryBySlug(slug: string): CategorySeo | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(
  id: Product["category"],
): CategorySeo | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryPath(id: Product["category"]): string {
  const cat = getCategoryById(id);
  return cat ? `/catalog/${cat.slug}` : "/catalog";
}

export function isCategorySlug(slug: string): boolean {
  return categories.some((c) => c.slug === slug);
}

export function allCategorySlugs(): string[] {
  return categories.map((c) => c.slug);
}
