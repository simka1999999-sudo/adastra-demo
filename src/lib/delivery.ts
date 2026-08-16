export type DeliveryCarrier = "cdek" | "ozon";

export type DeliveryQuote = {
  carrier: DeliveryCarrier;
  label: string;
  price: number;
  daysMin: number;
  daysMax: number;
  note?: string;
};

/** Базовые тарифы до подключения live API (СДЭК / Ozon Логистика). */
const FALLBACK: Record<DeliveryCarrier, Omit<DeliveryQuote, "carrier">> = {
  cdek: {
    label: "СДЭК — ПВЗ / курьер",
    price: 450,
    daysMin: 2,
    daysMax: 7,
    note: "Точный тариф уточняется по индексу после подключения API СДЭК",
  },
  ozon: {
    label: "Ozon Доставка",
    price: 390,
    daysMin: 2,
    daysMax: 6,
    note: "Интеграция Ozon Логистика — по ключам Seller API",
  },
};

export function isDeliveryApiConfigured() {
  return Boolean(
    process.env.CDEK_CLIENT_ID &&
      process.env.CDEK_CLIENT_SECRET &&
      process.env.OZON_CLIENT_ID &&
      process.env.OZON_API_KEY,
  );
}

/** Синхронный тариф для UI и статического демо (без API). */
export function quoteDeliveryLocal(input: {
  carrier: DeliveryCarrier;
  city?: string;
}): DeliveryQuote {
  const base = FALLBACK[input.carrier];
  let price = base.price;
  const city = (input.city || "").toLowerCase();
  if (city.includes("москв") || city.includes("moscow")) {
    price = Math.max(0, base.price - 150);
  } else if (city.includes("спб") || city.includes("петербург")) {
    price = Math.max(0, base.price - 80);
  }
  return {
    carrier: input.carrier,
    label: base.label,
    price,
    daysMin: base.daysMin,
    daysMax: base.daysMax,
    note: base.note,
  };
}

/**
 * Расчёт стоимости доставки.
 * С ключами — сюда подключаются реальные методы СДЭК и Ozon Логистика.
 * Без ключей — прозрачные fallback-тарифы для отображения в checkout.
 */
export async function quoteDelivery(input: {
  carrier: DeliveryCarrier;
  city?: string;
  postalCode?: string;
  weightGrams?: number;
}): Promise<DeliveryQuote> {
  // Хуки под API (пока stub — не ломаем checkout без ключей)
  if (input.carrier === "cdek" && process.env.CDEK_CLIENT_ID) {
    // TODO: CDEK calculator API when credentials provided
  }
  if (input.carrier === "ozon" && process.env.OZON_API_KEY) {
    // TODO: Ozon Logistics quote — https://dev.ozon.ru/
  }

  return quoteDeliveryLocal(input);
}

export function deliveryOptions(): DeliveryCarrier[] {
  return ["cdek", "ozon"];
}
