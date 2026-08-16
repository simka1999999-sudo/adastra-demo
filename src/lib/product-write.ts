import { z } from "zod";
import type { Product } from "@/lib/types";
import {
  buildProductSlug,
  buildProductTitle,
  sanitizeSegment,
} from "@/lib/catalog-identity";

export const productWriteSchema = z.object({
  id: z.string().optional(),
  masterSku: z.string().min(1).max(80),
  shortTitle: z.string().min(1).max(80),
  color: z.string().min(1).max(40),
  category: z.enum(["overalls", "jackets", "coats", "pants"]),
  gender: z.enum(["women", "men", "unisex"]).default("women"),
  price: z.number().int().positive(),
  oldPrice: z.number().int().positive().optional().nullable(),
  collection: z.string().min(1),
  season: z.string().min(1),
  country: z.string().min(1),
  materials: z.string().min(1),
  insulation: z.string().min(1),
  temperature: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()).default([]),
  sizes: z
    .array(
      z.object({
        label: z.string().min(1),
        inStock: z.boolean().default(true),
      }),
    )
    .min(1),
  care: z.string().optional().default(""),
  colorGroup: z.string().optional().nullable(),
  ozonId: z.number().int().optional().nullable(),
  hitRank: z.number().int().optional().nullable(),
  inStock: z.boolean().default(true),
  isHit: z.boolean().default(false),
  isNew: z.boolean().default(false),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
});

export type ProductWrite = z.infer<typeof productWriteSchema>;

export function toCatalogProduct(input: ProductWrite, current?: Product): Product {
  const masterSku = sanitizeSegment(input.masterSku.toLowerCase());
  const id = current?.id || `p-${masterSku}`;
  const slug = current?.slug || buildProductSlug({ category: input.category, masterSku });
  const color = input.color.trim().toLowerCase();
  const title = buildProductTitle({
    category: input.category,
    shortTitle: input.shortTitle,
    color,
  });
  const sizes = input.sizes.map((s) => ({
    id: `${masterSku}_${s.label}`,
    label: s.label,
    inStock: s.inStock,
  }));
  const seoTitle = input.seoTitle.trim() || `${title} — купить`;
  const seoDescription =
    input.seoDescription.trim() ||
    `${title}. ${input.temperature}. Доставка по России, оплата онлайн.`;

  return {
    id,
    slug,
    masterSku,
    title,
    shortTitle: input.shortTitle.trim(),
    price: input.price,
    oldPrice: input.oldPrice || undefined,
    category: input.category,
    gender: input.gender,
    colors: [color],
    collection: input.collection.trim(),
    season: input.season.trim(),
    country: input.country.trim(),
    materials: input.materials.trim(),
    insulation: input.insulation.trim(),
    temperature: input.temperature.trim(),
    description: input.description.trim(),
    features: input.features.map((f) => f.trim()).filter(Boolean),
    images: current?.images ?? [],
    sizes,
    seo: { title: seoTitle, description: seoDescription },
    inStock: input.inStock,
    featured: input.isHit,
    isHit: input.isHit,
    isNew: input.isNew,
    colorGroup: input.colorGroup?.trim() || null,
    care: input.care?.trim() || undefined,
    ozonId: input.ozonId ?? null,
    hitRank: input.isHit ? (input.hitRank ?? 50) : undefined,
  };
}
