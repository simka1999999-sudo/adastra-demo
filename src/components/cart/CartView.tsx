"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { QtyStepper } from "@/components/ui/QtyStepper";
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
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          Добавьте комбинезон или другую модель из каталога — оформить заказ
          можно без регистрации.
        </p>
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
            <Link href={`/catalog/${item.slug}`} className="relative aspect-[3/4] overflow-hidden bg-line/40">
              <Image src={item.image} alt="" fill className="object-cover" sizes="120px" />
            </Link>
            <div>
              <Link href={`/catalog/${item.slug}`} className="font-medium underline-offset-4 hover:underline">
                {item.title}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">{item.sizeLabel}</p>
              <p className="mt-2 text-sm">{formatPrice(item.price)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <QtyStepper
                  id={`qty-${item.productId}-${item.sizeId}`}
                  value={item.quantity}
                  onChange={(n) => setQuantity(item.productId, item.sizeId, n)}
                />
                <button
                  type="button"
                  className="min-h-10 text-sm underline underline-offset-4 text-ink-muted hover:text-ink"
                  onClick={() => removeItem(item.productId, item.sizeId)}
                >
                  Удалить
                </button>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-semibold tabular-nums">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit border border-line bg-bg-elevated p-6 lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
        <p className="text-[0.72rem] tracking-[0.14em] uppercase text-ink-muted">Итого</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{formatPrice(total)}</p>
        <Link href="/checkout" className="btn mt-6 w-full">
          Оформить заказ
        </Link>
        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
          Доставка по Москве с примеркой или по России в ПВЗ / курьером.
        </p>
      </aside>
    </div>
  );
}
