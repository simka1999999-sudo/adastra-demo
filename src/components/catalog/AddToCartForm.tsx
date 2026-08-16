"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { ChipButton } from "@/components/ui/Chip";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { formatPrice } from "@/lib/products";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [sizeId, setSizeId] = useState(product.sizes.find((s) => s.inStock)?.id ?? "");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<"ok" | "size" | "">("");

  const selected = product.sizes.find((s) => s.id === sizeId);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setMessage("size");
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      sizeId: selected.id,
      sizeLabel: selected.label,
      quantity: qty,
      image: product.images[0] || "",
    });
    setMessage("ok");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <p className="text-2xl font-semibold tracking-tight">{formatPrice(product.price)}</p>
        {product.oldPrice ? (
          <p className="mt-1 text-sm text-ink-muted line-through">
            {formatPrice(product.oldPrice)}
          </p>
        ) : null}
        <p className={`mt-1 text-sm ${product.inStock ? "text-success" : "text-danger"}`}>
          {product.inStock ? "В наличии" : "Нет в наличии"}
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="label mb-0">Размер</p>
          <Link href="/size-guide" className="text-sm underline underline-offset-4">
            Таблица размеров
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.sizes.map((s) => (
            <ChipButton
              key={s.id}
              active={sizeId === s.id}
              disabled={!s.inStock}
              onClick={() => {
                setSizeId(s.id);
                setMessage("");
              }}
            >
              {s.label}
            </ChipButton>
          ))}
        </div>
        {message === "size" ? (
          <p className="mt-2 text-sm text-danger">Выберите размер</p>
        ) : null}
      </div>

      <div>
        <label className="label" htmlFor="qty">
          Количество
        </label>
        <QtyStepper id="qty" value={qty} onChange={setQty} />
      </div>

      <button type="submit" className="btn w-full sm:w-auto" disabled={!product.inStock}>
        Добавить в корзину
      </button>
      {message === "ok" ? (
        <p className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-success">Добавлено в корзину</span>
          <Link href="/cart" className="chip">
            Перейти в корзину
          </Link>
        </p>
      ) : null}
    </form>
  );
}
