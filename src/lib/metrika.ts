export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const id = process.env.NEXT_PUBLIC_METRIKA_ID;
  if (!id) return;
  const w = window as Window & {
    ym?: (id: number | string, method: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  w.ym?.(id, "reachGoal", goal, params);
}

/** Цели под Директ/Метрику — имена стабильные, не переименовывать без синхронизации кабинета. */
export const MetrikaGoals = {
  viewProduct: "view_product",
  addToCart: "add_to_cart",
  beginCheckout: "begin_checkout",
  purchase: "purchase",
} as const;

type EcommerceProduct = {
  id: string;
  name: string;
  price: number;
  category?: string;
  variant?: string;
  quantity?: number;
};

function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

export function trackViewProduct(product: EcommerceProduct) {
  pushDataLayer({
    ecommerce: {
      currencyCode: "RUB",
      detail: { products: [product] },
    },
  });
  reachGoal(MetrikaGoals.viewProduct, { product_id: product.id });
}

export function trackAddToCart(product: EcommerceProduct) {
  pushDataLayer({
    ecommerce: {
      currencyCode: "RUB",
      add: { products: [product] },
    },
  });
  reachGoal(MetrikaGoals.addToCart, {
    product_id: product.id,
    price: product.price,
    quantity: product.quantity ?? 1,
  });
}

export function trackBeginCheckout(products: EcommerceProduct[], revenue: number) {
  reachGoal(MetrikaGoals.beginCheckout, {
    revenue,
    products: products.map((p) => p.id),
  });
}

export function trackPurchase(orderId: string, products: EcommerceProduct[], revenue: number) {
  pushDataLayer({
    ecommerce: {
      currencyCode: "RUB",
      purchase: {
        actionField: { id: orderId, revenue },
        products,
      },
    },
  });
  reachGoal(MetrikaGoals.purchase, { order_id: orderId, revenue });
}
