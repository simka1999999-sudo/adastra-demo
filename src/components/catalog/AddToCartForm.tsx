"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/products";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [sizeId, setSizeId] = useState(product.sizes.find((s) => s.inStock)?.id ?? "");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  const selected = product.sizes.find((s) => s.id === sizeId);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setMessage("Выберите размер");
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
      image: product.images[0],
    });
    setMessage("Добавлено в корзину");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <p className="text-2xl">{formatPrice(product.price)}</p>
        {product.oldPrice ? (
          <p className="mt-1 text-sm text-ink-muted line-through">
            {formatPrice(product.oldPrice)}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-success">
          {product.inStock ? "В наличии" : "Нет в наличии"}
        </p>
      </div>

      <div>
        <label className="label" htmlFor="size">
          Размер
        </label>
        <select
          id="size"
          className="field"
          value={sizeId}
          onChange={(e) => setSizeId(e.target.value)}
          required
        >
          <option value="">Выберите размер</option>
          {product.sizes.map((s) => (
            <option key={s.id} value={s.id} disabled={!s.inStock}>
              {s.label}
              {!s.inStock ? " — нет" : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="qty">
          Количество
        </label>
        <input
          id="qty"
          className="field max-w-28"
          type="number"
          min={1}
          max={10}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value) || 1)}
        />
      </div>

      <button type="submit" className="btn w-full sm:w-auto" disabled={!product.inStock}>
        Добавить в корзину
      </button>
      {message ? <p className="text-sm text-ink-muted">{message}</p> : null}
    </form>
  );
}
