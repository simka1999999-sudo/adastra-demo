import type { Product } from "@/lib/types";
import catalog from "./catalog.json";

type CatalogRow = Product & {
  care?: string;
  colorGroup?: string | null;
  ozonId?: number | null;
  hitRank?: number;
};

export const products: Product[] = (catalog as CatalogRow[]).map((row) => ({
  ...row,
  featured: Boolean(row.isHit),
}));

export const categoryLabels: Record<Product["category"], string> = {
  overalls: "Комбинезоны",
  jackets: "Куртки",
  coats: "Пальто",
  pants: "Брюки",
};
