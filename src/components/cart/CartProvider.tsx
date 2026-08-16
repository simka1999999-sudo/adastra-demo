"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useEffectEvent,
} from "react";
import type { CartItem } from "@/lib/types";
import { CART_STORAGE_KEY, cartCount, cartKey, cartTotal } from "@/lib/cart";
import { trackAddToCart } from "@/lib/metrika";
import { siteConfig, withBasePath } from "@/lib/site";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  addItem: (item: CartItem) => void;
  setQuantity: (productId: string, sizeId: string, quantity: number) => void;
  removeItem: (productId: string, sizeId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readLocal(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota / private mode */
  }
}

async function syncFromServer(): Promise<CartItem[]> {
  if (siteConfig.isStaticDemo) return readLocal();
  try {
    const res = await fetch(withBasePath("/api/cart"), { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { items: CartItem[] };
      return data.items ?? [];
    }
  } catch {
    /* offline / static host */
  }
  return readLocal();
}

async function pushToServer(items: CartItem[]) {
  writeLocal(items);
  if (siteConfig.isStaticDemo) return;
  try {
    await fetch(withBasePath("/api/cart"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  } catch {
    /* localStorage already saved */
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const hydrate = useEffectEvent(async () => {
    const next = await syncFromServer();
    setItems(next);
    setReady(true);
  });

  useEffect(() => {
    void hydrate();
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    void pushToServer(next);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = cartKey(item);
      const existing = prev.find((i) => cartKey(i) === key);
      const next = existing
        ? prev.map((i) =>
            cartKey(i) === key
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          )
        : [...prev, item];
      void pushToServer(next);
      return next;
    });
    trackAddToCart({
      id: item.productId,
      name: item.title,
      price: item.price,
      variant: item.sizeLabel,
      quantity: item.quantity,
    });
  }, []);

  const setQuantity = useCallback(
    (productId: string, sizeId: string, quantity: number) => {
      setItems((prev) => {
        const next =
          quantity <= 0
            ? prev.filter(
                (i) => !(i.productId === productId && i.sizeId === sizeId),
              )
            : prev.map((i) =>
                i.productId === productId && i.sizeId === sizeId
                  ? { ...i, quantity }
                  : i,
              );
        void pushToServer(next);
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string, sizeId: string) => {
    setItems((prev) => {
      const next = prev.filter(
        (i) => !(i.productId === productId && i.sizeId === sizeId),
      );
      void pushToServer(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo(
    () => ({
      items,
      count: cartCount(items),
      total: cartTotal(items),
      ready,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, ready, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
