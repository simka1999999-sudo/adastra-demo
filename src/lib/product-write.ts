import { z } from "zod";
import type { Product } from "@/lib/types";
import {
  buildProductSlug,
  buildProductTitle,
  sanitizeSegment,
} from "@/lib/catalog-identity";
import {
  CARE_PLACEHOLDER,
  COLOR_PLACEHOLDER,
  DEFAULT_COLLECTION,
  DEFAULT_COUNTRY,
  DEFAULT_INSULATION,
  DEFAULT_SEASON,
  DEFAULT_SIZE_LABELS,
  DEFAULT_TEMPERATURE,
  DESCRIPTION_PLACEHOLDER,
  SPEC_PLACEHOLDER,
  filledOr,
} from "@/lib/catalog-defaults";

export const productWriteSchema = z.object({
  id: z.string().optional(),
  masterSku: z.string().min(1).max(80),
  shortTitle: z.string().min(1).max(80),
  color: z.string().max(40).optional().default(""),
  category: z.enum(["overalls", "jackets", "coats", "pants"]).default("overalls"),
  gender: z.enum(["women", "men", "unisex"]).default("women"),
  price: z.number().int().positive(),
  oldPrice: z.number().int().positive().optional().nullable(),
  collection: z.string().optional().default(""),
  season: z.string().optional().default(""),
  country: z.string().optional().default(""),
  materials: z.string().optional().default(""),
  insulation: z.string().optional().default(""),
  temperature: z.string().optional().default(""),
  description: z.string().optional().default(""),
  features: z.array(z.string()).default([]),
  sizes: z
    .array(
      z.object({
        label: z.string().min(1),
        inStock: z.boolean().default(true),
      }),
    )
    .default([]),
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
  const color = filledOr(input.color, COLOR_PLACEHOLDER).toLowerCase();
  const shortTitle = input.shortTitle.trim();
  const title = buildProductTitle({
    category: input.category,
    shortTitle,
    color,
  });
  const sizeLabels = input.sizes.length
    ? input.sizes
    : DEFAULT_SIZE_LABELS.map((label) => ({ label, inStock: true }));
  const sizes = sizeLabels.map((s) => ({
    id: `${masterSku}_${s.label}`,
    label: s.label,
    inStock: s.inStock,
  }));
  const temperature = filledOr(input.temperature, DEFAULT_TEMPERATURE);
  const seoTitle = input.seoTitle.trim() || `${title} — купить`;
  const seoDescription =
    input.seoDescription.trim() ||
    `${title}. ${temperature}. Доставка по России, оплата онлайн.`;

  return {
    id,
    slug,
    masterSku,
    title,
    shortTitle,
    price: input.price,
    oldPrice: input.oldPrice || undefined,
    category: input.category,
    gender: input.gender,
    colors: [color],
    collection: filledOr(input.collection, DEFAULT_COLLECTION),
    season: filledOr(input.season, DEFAULT_SEASON),
    country: filledOr(input.country, DEFAULT_COUNTRY),
    materials: filledOr(input.materials, SPEC_PLACEHOLDER),
    insulation: filledOr(input.insulation, DEFAULT_INSULATION),
    temperature,
    description: filledOr(input.description, DESCRIPTION_PLACEHOLDER),
    features: input.features.map((f) => f.trim()).filter(Boolean),
    images: current?.images ?? [],
    sizes,
    seo: { title: seoTitle, description: seoDescription },
    inStock: input.inStock,
    featured: input.isHit,
    isHit: input.isHit,
    isNew: input.isNew,
    colorGroup: input.colorGroup?.trim() || null,
    care: filledOr(input.care, current?.care || CARE_PLACEHOLDER),
    ozonId: input.ozonId ?? current?.ozonId ?? null,
    hitRank: input.isHit ? (input.hitRank ?? current?.hitRank ?? 50) : undefined,
  };
}
