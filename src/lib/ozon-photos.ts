import "server-only";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Product } from "@/lib/types";
import {
  productPhotoDir,
  readCatalog,
  removeStoredPhoto,
  sanitizeSegment,
  upsertCatalogProducts,
} from "@/lib/catalog-store";
import { isRealProductPhoto } from "@/lib/catalog-defaults";
import {
  loadOzonCatalog,
  loadOzonOffersByProductIds,
  matchOzonOffer,
  ozonSellerConfigured,
} from "@/lib/ozon-seller";

const MAX_PHOTOS = 12;
const MAX_BYTES = 8 * 1024 * 1024;

export type OzonPhotoRow = {
  id: string;
  sku: string;
  title: string;
  status: "ok" | "skip" | "miss" | "error";
  photos: number;
  ozonId?: number;
  detail: string;
};

function allowedHost(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.endsWith("ozone.ru") ||
      host.endsWith("ozon.ru") ||
      host.endsWith("ozonusercontent.com")
    );
  } catch {
    return false;
  }
}

function extFrom(buf: Buffer, type: string, url: string) {
  if (type.includes("png") || buf[0] === 0x89) return "png";
  if (type.includes("webp") || buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (type.includes("jpeg") || type.includes("jpg") || buf[0] === 0xff) return "jpg";
  if (/\.png(\?|$)/i.test(url)) return "png";
  if (/\.webp(\?|$)/i.test(url)) return "webp";
  return "jpg";
}

async function downloadImage(url: string) {
  if (!allowedHost(url)) return null;
  const res = await fetch(url, {
    headers: { "User-Agent": "ADASTRA-shop/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100 || buf.length > MAX_BYTES) return null;
  const type = res.headers.get("content-type") || "";
  if (type.startsWith("text/") || type.includes("json") || type.includes("html")) {
    return null;
  }
  return { buf, ext: extFrom(buf, type, url) };
}

async function saveOzonPhotos(productId: string, urls: string[]) {
  const dir = productPhotoDir(productId);
  mkdirSync(dir, { recursive: true });
  const stamp = Date.now();
  const files = await Promise.all(
    urls.slice(0, MAX_PHOTOS).map(async (url, i) => {
      const file = await downloadImage(url);
      if (!file) return null;
      const name = `ozon-${stamp}-${i}.${file.ext}`;
      writeFileSync(join(dir, name), file.buf);
      return `/products/${sanitizeSegment(productId)}/${name}`;
    }),
  );
  return files.filter((src): src is string => Boolean(src));
}

export async function pullOzonPhotos(options: {
  ids?: string[];
  onlyMissing?: boolean;
  force?: boolean;
}) {
  if (!ozonSellerConfigured()) {
    throw new Error("Задайте OZON_CLIENT_ID и OZON_API_KEY в .env и перезапустите сервер");
  }
  const catalog = readCatalog();
  const targets = options.ids?.length
    ? catalog.filter((p) => options.ids!.includes(p.id))
    : catalog;
  const need = targets.filter(
    (p) => options.force || options.onlyMissing === false || !p.images.some(isRealProductPhoto),
  );
  const knownIds = need
    .map((p) => p.ozonId)
    .filter((id): id is number => typeof id === "number" && id > 0);
  const offers =
    knownIds.length === need.length && need.length
      ? await loadOzonOffersByProductIds(knownIds)
      : await loadOzonCatalog();
  const rows: OzonPhotoRow[] = [];
  const updates: Product[] = [];

  for (const product of targets) {
    const base: OzonPhotoRow = {
      id: product.id,
      sku: product.masterSku || product.id,
      title: product.shortTitle,
      status: "skip",
      photos: 0,
      detail: "",
    };
    const hasReal = product.images.some(isRealProductPhoto);
    if (!options.force && options.onlyMissing !== false && hasReal) {
      rows.push({ ...base, detail: "свои фото уже есть" });
      continue;
    }
    const offer = matchOzonOffer(product, offers);
    if (!offer) {
      rows.push({ ...base, status: "miss", detail: "на Ozon не нашлось" });
      continue;
    }
    if (!offer.images.length) {
      rows.push({
        ...base,
        status: "miss",
        ozonId: offer.productId,
        detail: `Ozon ${offer.offerId || offer.productId}: нет фото`,
      });
      continue;
    }
    try {
      if (options.force) {
        product.images.filter(isRealProductPhoto).forEach(removeStoredPhoto);
      }
      const keep = options.force ? [] : product.images.filter(isRealProductPhoto);
      const added = await saveOzonPhotos(product.id, offer.images);
      if (!added.length) {
        rows.push({
          ...base,
          status: "error",
          ozonId: offer.productId,
          detail: "ссылки Ozon не скачались",
        });
        continue;
      }
      const next: Product = {
        ...product,
        ozonId: offer.productId,
        images: [...added, ...keep].slice(0, MAX_PHOTOS),
      };
      updates.push(next);
      rows.push({
        ...base,
        status: "ok",
        photos: added.length,
        ozonId: offer.productId,
        detail: offer.offerId || String(offer.productId),
      });
    } catch (err) {
      rows.push({
        ...base,
        status: "error",
        ozonId: offer.productId,
        detail: err instanceof Error ? err.message : "Ошибка загрузки",
      });
    }
  }

  if (updates.length) upsertCatalogProducts(updates);

  return {
    ozonProducts: offers.length,
    pulled: rows.filter((r) => r.status === "ok").length,
    skipped: rows.filter((r) => r.status === "skip").length,
    missed: rows.filter((r) => r.status === "miss").length,
    failed: rows.filter((r) => r.status === "error").length,
    rows,
  };
}

