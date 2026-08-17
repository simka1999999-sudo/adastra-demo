import { products as bundled, categoryLabels } from "../../content/products";
import type { Product } from "./types";
import { isRealProductPhoto, productPhotoStatus } from "./catalog-defaults";

export { categoryLabels };

/** Снимок JSON на момент сборки (GitHub Pages / sitemap). */
export const products = bundled;

export {
  displaySpec,
  isLookbookPlaceholder,
  isPlaceholderSpec,
  isRealProductPhoto,
  isUploadedPhoto,
  productPhotoStatus,
  storefrontImages,
} from "./catalog-defaults";

export function isOwnProductPhoto(src: string) {
  return src.startsWith("/uploads/products/");
}

export function isPlaceholderPhoto(src: string) {
  return !isRealProductPhoto(src);
}

export function productHasOwnPhotos(product: Pick<Product, "images">) {
  return productPhotoStatus(product) === "ready";
}

export function productImageAlt(
  product: Pick<Product, "title" | "shortTitle" | "colors">,
  index = 0,
) {
  const base = product.title || product.shortTitle;
  return index === 0 ? base : `${base} · фото ${index + 1}`;
}

/** Рост из ярлыка: «164 M 46» → 164, «122» → 122. */
export function sizeHeight(label: string): string | null {
  const match = label.trim().match(/^(\d{3})\b/);
  return match ? match[1] : null;
}

export function isKidsCollection(product: Product): boolean {
  const hay = `${product.collection} ${product.title} ${product.shortTitle}`;
  return /детск|kids/i.test(hay);
}

export function isWomenCollection(product: Product): boolean {
  return /женск/i.test(product.collection) || product.gender === "women";
}

export type ProductFilters = {
  category?: string;
  color?: string;
  size?: string;
  collection?: string;
  q?: string;
  sort?: "price_asc" | "price_desc" | "new";
  audience?: "women" | "all";
};

export function applyFacets(
  list: Product[],
  filters: Pick<ProductFilters, "color" | "size" | "sort" | "collection" | "q">,
): Product[] {
  let next = list;
  if (filters.q) {
    const q = filters.q.toLowerCase().trim();
    next = next.filter((p) => {
      const hay = `${p.title} ${p.shortTitle} ${p.masterSku || ""} ${p.id}`;
      return hay.toLowerCase().includes(q);
    });
  }
  if (filters.color) {
    const q = filters.color.toLowerCase();
    next = next.filter((p) =>
      p.colors.some((c) => c.toLowerCase().includes(q)),
    );
  }
  if (filters.size) {
    const q = filters.size.toLowerCase();
    next = next.filter((p) =>
      p.sizes.some((s) => {
        if (!s.inStock) return false;
        if (s.id === filters.size || s.label.toLowerCase() === q) return true;
        return sizeHeight(s.label) === filters.size;
      }),
    );
  }
  if (filters.collection) {
    next = next.filter((p) => p.collection === filters.collection);
  }

  switch (filters.sort) {
    case "price_asc":
      return [...next].sort((a, b) => a.price - b.price);
    case "price_desc":
      return [...next].sort((a, b) => b.price - a.price);
    case "new":
      return [...next].sort(
        (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
      );
    default:
      return [...next].sort((a, b) => {
        const hit = (a.hitRank ?? 99) - (b.hitRank ?? 99);
        if (hit !== 0) return hit;
        return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
      });
  }
}

export function scopeProducts(list: Product[], filters: ProductFilters = {}): Product[] {
  let next = list.filter((p) => p.inStock);
  if (filters.category) next = next.filter((p) => p.category === filters.category);
  if (filters.audience === "women") {
    next = next.filter((p) => isWomenCollection(p) && !isKidsCollection(p));
  }
  return applyFacets(next, filters);
}

export function getFilterOptions(list: Product[]) {
  const inStock = list.filter((p) => p.inStock);
  const colors = Array.from(new Set(inStock.flatMap((p) => p.colors))).sort();
  const collections = Array.from(new Set(inStock.map((p) => p.collection))).sort();
  const sizes = Array.from(
    new Set(
      inStock.flatMap((p) =>
        p.sizes
          .filter((s) => s.inStock)
          .map((s) => sizeHeight(s.label))
          .filter((h): h is string => Boolean(h)),
      ),
    ),
  )
    .sort((a, b) => Number(a) - Number(b))
    .map((height) => ({ id: height, label: `${height} см` }));
  const categories = Object.entries(categoryLabels).map(([id, label]) => ({
    id,
    label,
  }));
  return { colors, collections, sizes, categories };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}
