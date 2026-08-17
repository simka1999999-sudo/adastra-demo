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
  const sepAt = (base: string) => {
    if (!offerLower.startsWith(base) || offerLower.length === base.length) {
      return offerLower === base;
    }
    return /[-_./]/.test(offerLower[base.length] || "");
  };
  if (sepAt(skuLower) || sepAt(`new${skuLower}`)) return true;
  if (off.startsWith(sku) && sku.length >= 6 && /^\d+$/.test(off.slice(sku.length))) {
    return true;
  }
  return sku.startsWith(off) && off.length >= 6;
}

function scoreOffer(offer: OzonOffer) {
  const durable = offer.images.filter((url) => !url.includes("multimedia-tmp")).length;
  return durable * 1000 + offer.images.length;
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
  const title = norm(input.shortTitle || "");
  const hay = `${input.masterSku || ""} ${input.shortTitle || ""} ${input.title || ""} ${input.ozonId ?? ""}`;
  const longs = new Set(longDigits(hay));
  if (input.ozonId) longs.add(String(input.ozonId));

  const seen = new Set<number>();
  const candidates: OzonOffer[] = [];
  const add = (list: OzonOffer[]) => {
    for (const offer of list) {
      if (seen.has(offer.productId)) continue;
      seen.add(offer.productId);
      candidates.push(offer);
    }
  };

  add(
    offers.filter(
      (o) =>
        longs.has(String(o.productId)) ||
        o.skus.some((id) => longs.has(String(id))) ||
        (o.sku != null && longs.has(String(o.sku))),
    ),
  );
  if (input.masterSku) {
    add(offers.filter((o) => skuMatchesOffer(input.masterSku || "", o.offerId)));
  }
  if (title.length >= 5) {
    const named = offers.filter((o) => norm(o.name).includes(title));
    if (named.length === 1) add(named);
  }

  if (!candidates.length) return null;
  const withPhotos = candidates.filter((o) => o.images.length);
  const pool = (withPhotos.length ? withPhotos : candidates).sort(
    (a, b) => scoreOffer(b) - scoreOffer(a),
  );
  if (input.ozonId) {
    const exact = pool.filter((o) => o.productId === input.ozonId);
    const exactPhotos = exact.filter((o) => o.images.length);
    if (exactPhotos.length && scoreOffer(exactPhotos[0]) >= scoreOffer(pool[0])) {
      return exactPhotos[0];
    }
  }
  return pool[0];
}
