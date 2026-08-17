export type OzonOffer = {
  productId: number;
  offerId: string;
  sku: number | null;
  skus: number[];
  name: string;
  images: string[];
};

function norm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "");
}

function longDigits(value: string) {
  return [...value.matchAll(/\d{6,}/g)].map((m) => m[0]);
}

function skuMatchesOffer(skuRaw: string, offerRaw: string) {
  const sku = norm(skuRaw);
  const off = norm(offerRaw);
  if (!sku || !off) return false;
  if (off === sku) return true;
  const skuLower = skuRaw.toLowerCase().trim();
  const offerLower = offerRaw.toLowerCase().trim();
  const sep = offerLower[skuLower.length];
  if (skuLower && offerLower.startsWith(skuLower) && sep && /[-_./]/.test(sep)) return true;
  if (off.startsWith(sku) && sku.length >= 6 && /^\d+$/.test(off.slice(sku.length))) return true;
  return sku.startsWith(off) && off.length >= 6;
}

export function matchOzonOffer(
  input: {
    ozonId?: number | null;
    masterSku?: string;
    shortTitle?: string;
    title?: string;
  },
  offers: OzonOffer[],
): OzonOffer | null {
  const sku = norm(input.masterSku || "");
  const title = norm(input.shortTitle || "");
  const hay = `${input.masterSku || ""} ${input.shortTitle || ""} ${input.title || ""} ${input.ozonId ?? ""}`;
  const longs = new Set(longDigits(hay));
  if (input.ozonId) longs.add(String(input.ozonId));

  const byId = offers.filter(
    (o) =>
      longs.has(String(o.productId)) ||
      o.skus.some((id) => longs.has(String(id))) ||
      (o.sku != null && longs.has(String(o.sku))),
  );
  if (byId.length === 1) return byId[0];
  if (byId.length > 1) {
    return byId.sort((a, b) => b.images.length - a.images.length)[0];
  }

  if (sku) {
    const byOffer = offers.filter((o) => skuMatchesOffer(input.masterSku || "", o.offerId));
    if (byOffer.length) {
      const exact = byOffer.filter((o) => norm(o.offerId) === sku);
      const pool = exact.length ? exact : byOffer;
      return pool.sort((a, b) => b.images.length - a.images.length)[0];
    }
  }

  if (title.length >= 5) {
    const named = offers.filter((o) => norm(o.name).includes(title));
    if (named.length === 1) return named[0];
    if (named.length > 1 && sku) {
      const withSku = named.filter((o) => skuMatchesOffer(input.masterSku || "", o.offerId));
      if (withSku.length) return withSku.sort((a, b) => b.images.length - a.images.length)[0];
    }
  }

  return null;
}
