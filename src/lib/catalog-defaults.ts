import type { Product } from "@/lib/types";

export const SPEC_PLACEHOLDER = "Уточняется";
export const DESCRIPTION_PLACEHOLDER =
  "Описание модели уточняется. Утеплённая одежда ADASTRA с доставкой по России.";
export const CARE_PLACEHOLDER = "Уход уточняется";
export const COLOR_PLACEHOLDER = "уточняется";
export const DEFAULT_COLLECTION = "Женская коллекция";
export const DEFAULT_SEASON = "Зима";
export const DEFAULT_COUNTRY = "Китай";
export const DEFAULT_TEMPERATURE = "от -5°С до -30°С";
export const DEFAULT_INSULATION = "Утеплитель уточняется";

export const DEFAULT_SIZE_LABELS = [
  "158 S 44",
  "164 M 46",
  "164 L 48",
  "170 M 46",
  "170 L 48",
  "176 M 46",
];

export function isBlank(value: string | undefined | null) {
  return !String(value ?? "").trim();
}

export function isPlaceholderSpec(value: string | undefined | null) {
  const v = String(value ?? "").trim();
  return (
    !v ||
    v === SPEC_PLACEHOLDER ||
    v === DESCRIPTION_PLACEHOLDER ||
    v === CARE_PLACEHOLDER ||
    v === DEFAULT_INSULATION ||
    v === COLOR_PLACEHOLDER
  );
}

export function displaySpec(value: string | undefined | null) {
  const v = String(value ?? "").trim();
  return v || SPEC_PLACEHOLDER;
}

export function filledOr(value: string | undefined | null, fallback: string) {
  const v = String(value ?? "").trim();
  return v || fallback;
}

export function isLookbookPlaceholder(src: string) {
  return src.startsWith("/lookbook/");
}

export function isUploadedPhoto(src: string) {
  return src.startsWith("/uploads/products/");
}

/** Свои снимки модели: загрузки из админки или исходные фото из /products/. */
export function isRealProductPhoto(src: string) {
  return isUploadedPhoto(src) || src.startsWith("/products/");
}

export function storefrontImages(product: Pick<Product, "images">) {
  return product.images.filter(isRealProductPhoto);
}

export function productPhotoStatus(
  product: Pick<Product, "images">,
): "ready" | "mixed" | "lookbook" | "none" {
  const images = product.images.filter(Boolean);
  if (!images.length) return "none";
  const real = images.filter(isRealProductPhoto);
  const lookbook = images.filter(isLookbookPlaceholder);
  if (real.length && lookbook.length) return "mixed";
  if (real.length) return "ready";
  return "lookbook";
}
