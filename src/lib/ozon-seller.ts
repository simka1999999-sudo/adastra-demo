import "server-only";
import { matchOzonOffer, type OzonOffer } from "@/lib/ozon-match";

export { parseOzonId } from "@/lib/ozon-id";
export { matchOzonOffer };
export type { OzonOffer };

const API = "https://api-seller.ozon.ru";

export function ozonSellerConfigured() {
  return Boolean(process.env.OZON_CLIENT_ID && process.env.OZON_API_KEY);
}

function headers() {
  const clientId = process.env.OZON_CLIENT_ID || "";
  const apiKey = process.env.OZON_API_KEY || "";
  if (!clientId || !apiKey) {
    throw new Error("Задайте OZON_CLIENT_ID и OZON_API_KEY в .env — ключи кабинета продавца Ozon");
  }
  return {
    "Content-Type": "application/json",
    "Client-Id": clientId,
    "Api-Key": apiKey,
  };
}

async function ozonPost(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await res.json().catch(() => null)) as
    | { message?: string; code?: number }
    | null;
  if (!res.ok) {
    throw new Error(json?.message || `Ozon API ${res.status}`);
  }
  return json as Record<string, unknown>;
}

function chunk<T>(list: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, size + i));
  return out;
}

function asUrls(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    return value.startsWith("http") ? [value] : [];
  }
  if (Array.isArray(value)) return value.flatMap(asUrls);
  if (typeof value === "object") {
    const rec = value as Record<string, unknown>;
    return asUrls(rec.url ?? rec.file_name ?? rec.src);
  }
  return [];
}

function uniqueUrls(urls: string[]) {
  const seen = new Set<string>();
  const durable: string[] = [];
  const tmp: string[] = [];
  for (const url of urls) {
    const clean = url.split("?")[0];
    if (!clean.startsWith("http") || seen.has(clean)) continue;
    seen.add(clean);
    if (clean.includes("multimedia-tmp")) tmp.push(url);
    else durable.push(url);
  }
  return durable.length ? durable : tmp;
}

function num(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function collectSkus(raw: Record<string, unknown>) {
  const ids: number[] = [];
  const top = num(raw.sku);
  if (top) ids.push(top);
  const sources = raw.sources;
  if (Array.isArray(sources)) {
    for (const src of sources) {
      if (!src || typeof src !== "object") continue;
      const sku = num((src as { sku?: unknown }).sku);
      if (sku) ids.push(sku);
    }
  }
  return [...new Set(ids)];
}

function parseInfoItem(raw: Record<string, unknown>): OzonOffer | null {
  const productId = num(raw.id ?? raw.product_id);
  if (!productId) return null;
  const skus = collectSkus(raw);
  const images = uniqueUrls([
    ...asUrls(raw.primary_image),
    ...asUrls(raw.images),
    ...asUrls(raw.color_image),
    ...asUrls(raw.primary_images),
    ...asUrls(raw.images360),
  ]);
  return {
    productId,
    offerId: String(raw.offer_id ?? ""),
    sku: skus[0] ?? null,
    skus,
    name: String(raw.name ?? ""),
    images,
  };
}

export async function listOzonProducts() {
  const items: Array<{ productId: number; offerId: string }> = [];
  let lastId = "";
  for (let i = 0; i < 40; i += 1) {
    const json = await ozonPost("/v3/product/list", {
      filter: { visibility: "ALL" },
      last_id: lastId,
      limit: 100,
    });
    const result = (json.result ?? json) as Record<string, unknown>;
    const rows = (result.items ?? []) as Array<Record<string, unknown>>;
    for (const item of rows) {
      const id = num(item.product_id ?? item.id);
      if (id) items.push({ productId: id, offerId: String(item.offer_id ?? "") });
    }
    lastId = String(result.last_id ?? "");
    if (!rows.length || !lastId) break;
  }
  return items;
}

export async function fetchOzonOffers(productIds: number[]) {
  const offers: OzonOffer[] = [];
  for (const group of chunk(productIds, 100)) {
    const json = await ozonPost("/v3/product/info/list", { product_id: group });
    const items = (json.items ??
      (json.result as { items?: unknown[] } | undefined)?.items ??
      json.result ??
      []) as unknown;
    const list = Array.isArray(items) ? items : [];
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      const parsed = parseInfoItem(item as Record<string, unknown>);
      if (parsed) offers.push(parsed);
    }
  }
  return offers;
}

async function fillMissingPictures(offers: OzonOffer[]) {
  const missing = offers.filter(
    (o) => !o.images.length || o.images.every((url) => url.includes("multimedia-tmp")),
  );
  if (!missing.length) return offers;
  const byId = new Map(offers.map((o) => [o.productId, o]));
  for (const group of chunk(missing.map((o) => o.productId), 100)) {
    const json = await ozonPost("/v2/product/pictures/info", {
      product_id: group.map(String),
    });
    const items = (json.items ?? []) as Array<Record<string, unknown>>;
    for (const item of items) {
      const id = num(item.product_id);
      const offer = id ? byId.get(id) : undefined;
      if (!offer) continue;
      offer.images = uniqueUrls([
        ...asUrls(item.primary_photo),
        ...asUrls(item.photo),
        ...asUrls(item.color_photo),
        ...asUrls(item.photo_360),
        ...offer.images,
      ]);
    }
  }
  return offers;
}

export async function loadOzonCatalog() {
  const listed = await listOzonProducts();
  const offers = await fetchOzonOffers(listed.map((p) => p.productId));
  const byId = new Map(offers.map((o) => [o.productId, o]));
  for (const row of listed) {
    const existing = byId.get(row.productId);
    if (existing) {
      if (!existing.offerId && row.offerId) existing.offerId = row.offerId;
    } else {
      offers.push({
        productId: row.productId,
        offerId: row.offerId,
        sku: null,
        skus: [],
        name: "",
        images: [],
      });
    }
  }
  return fillMissingPictures(offers);
}

export async function loadOzonOffersByProductIds(productIds: number[]) {
  const ids = [...new Set(productIds.filter((id) => Number.isFinite(id) && id > 0))];
  if (!ids.length) return [];
  return fillMissingPictures(await fetchOzonOffers(ids));
}
