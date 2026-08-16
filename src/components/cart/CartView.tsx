"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/products";

export function CartView() {
  const { items, total, ready, setQuantity, removeItem } = useCart();

  if (!ready) {
    return <p className="text-ink-muted">Загрузка корзины…</p>;
  }

  if (!items.length) {
    return (
      <div>
        <p className="text-lg">Корзина пуста</p>
        <Link href="/catalog" className="btn mt-6 inline-flex">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.sizeId}`}
            className="grid grid-cols-[96px_1fr] gap-4 border border-line bg-bg-elevated p-3 sm:grid-cols-[120px_1fr_auto]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-line/40">
              <Image src={item.image} alt="" fill className="object-cover" sizes="120px" />
            </div>
            <div>
              <Link href={`/catalog/${item.slug}`} className="font-medium">
                {item.title}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">{item.sizeLabel}</p>
              <p className="mt-2 text-sm">{formatPrice(item.price)}</p>
              <div className="mt-3 flex items-center gap-3">
                <label className="sr-only" htmlFor={`qty-${item.productId}-${item.sizeId}`}>
                  Количество
                </label>
                <input
                  id={`qty-${item.productId}-${item.sizeId}`}
                  type="number"
                  min={1}
                  max={10}
                  className="field max-w-20"
                  value={item.quantity}
                  onChange={(e) =>
                    setQuantity(item.productId, item.sizeId, Number(e.target.value) || 1)
                  }
                />
                <button
                  type="button"
                  className="text-sm text-ink-muted underline underline-offset-4"
                  onClick={() => removeItem(item.productId, item.sizeId)}
                >
                  Удалить
                </button>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p>{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit border border-line bg-bg-elevated p-6">
        <p className="text-[0.72rem] tracking-[0.14em] uppercase text-ink-muted">Итого</p>
        <p className="mt-2 text-3xl">{formatPrice(total)}</p>
        <Link href="/checkout" className="btn mt-6 w-full">
          Оформить заказ
        </Link>
        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
          Доставка по Москве с примеркой или по России в ПВЗ / курьером. Подробности на странице
          доставки.
        </p>
      </aside>
    </div>
  );
}
