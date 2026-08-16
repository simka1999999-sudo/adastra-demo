import type { Product } from "@/lib/types";

export function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "item";
}

export const CATEGORY_SLUG: Record<Product["category"], string> = {
  overalls: "kombinezon",
  jackets: "kurtka",
  coats: "palto",
  pants: "bryuki",
};

export const CATEGORY_TITLE: Record<Product["category"], string> = {
  overalls: "Комбинезон",
  jackets: "Куртка",
  coats: "Пальто",
  pants: "Брюки",
};

export function buildProductTitle(input: {
  category: Product["category"];
  shortTitle: string;
  color: string;
}) {
  const color = input.color.trim();
  const name = input.shortTitle.trim();
  const kind = CATEGORY_TITLE[input.category];
  return color
    ? `${kind} ADASTRA ${name} · ${color}`
    : `${kind} ADASTRA ${name}`;
}

export function buildProductSlug(input: {
  category: Product["category"];
  masterSku: string;
}) {
  const sku = sanitizeSegment(input.masterSku.toLowerCase());
  return `${CATEGORY_SLUG[input.category]}-${sku}`;
}
