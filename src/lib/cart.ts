import type { CartItem } from "./types";

export const CART_COOKIE = "adastra_cart";
export const CART_STORAGE_KEY = "adastra_cart_v1";

export function cartKey(item: Pick<CartItem, "productId" | "sizeId">): string {
  return `${item.productId}__${item.sizeId}`;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function parseCartCookie(value: string | undefined): CartItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.sizeId === "string" &&
        typeof item.quantity === "number",
    );
  } catch {
    return [];
  }
}

export function serializeCartCookie(items: CartItem[]): string {
  return encodeURIComponent(JSON.stringify(items));
}
