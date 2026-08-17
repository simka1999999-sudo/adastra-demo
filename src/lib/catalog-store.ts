import "server-only";
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Product } from "@/lib/types";
import { sanitizeSegment } from "@/lib/catalog-identity";

export { sanitizeSegment };
export {
  CATEGORY_SLUG,
  CATEGORY_TITLE,
  buildProductSlug,
  buildProductTitle,
} from "@/lib/catalog-identity";

const CATALOG_REL = join("content", "products", "catalog.json");
const UPLOAD_REL = join("public", "uploads", "products");
const PRODUCT_PHOTO_REL = join("public", "products");

export function catalogFilePath() {
  return join(process.cwd(), CATALOG_REL);
}

export function productUploadDir(productId: string) {
  return join(process.cwd(), UPLOAD_REL, sanitizeSegment(productId));
}

export function productPhotoDir(productId: string) {
  return join(process.cwd(), PRODUCT_PHOTO_REL, sanitizeSegment(productId));
}

export function isOwnProductPhoto(src: string) {
  return src.startsWith("/uploads/products/");
}

export function isOzonStorePhoto(src: string) {
  return /^\/products\/[^/]+\/ozon-\d+-\d+\.(jpe?g|png|webp)$/i.test(src);
}

export function isPlaceholderPhoto(src: string) {
  return !isOwnProductPhoto(src);
}

export function productHasOwnPhotos(product: Pick<Product, "images">) {
  return product.images.length > 0 && product.images.every(isOwnProductPhoto);
}

function mapRow(row: Product): Product {
  return { ...row, featured: Boolean(row.isHit || row.featured) };
}

export function readCatalog(): Product[] {
  const raw = readFileSync(catalogFilePath(), "utf8");
  return (JSON.parse(raw) as Product[]).map(mapRow);
}

export function writeCatalog(list: Product[]) {
  const path = catalogFilePath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(list, null, 2)}\n`, "utf8");
}

export function upsertCatalogProduct(next: Product) {
  const list = readCatalog();
  const i = list.findIndex((p) => p.id === next.id);
  if (i === -1) list.push(next);
  else list[i] = next;
  writeCatalog(list);
  return next;
}

export function upsertCatalogProducts(items: Product[]) {
  const list = readCatalog();
  for (const next of items) {
    const i = list.findIndex((p) => p.id === next.id);
    if (i === -1) list.push(next);
    else list[i] = next;
  }
  writeCatalog(list);
}

export function removeCatalogProduct(id: string) {
  writeCatalog(readCatalog().filter((p) => p.id !== id));
}

export function removeUploadedFile(src: string) {
  removeStoredPhoto(src);
}

export function removeStoredPhoto(src: string) {
  if (!isOwnProductPhoto(src) && !isOzonStorePhoto(src)) return;
  const abs = join(process.cwd(), "public", src.replace(/^\//, ""));
  if (existsSync(abs)) unlinkSync(abs);
}
