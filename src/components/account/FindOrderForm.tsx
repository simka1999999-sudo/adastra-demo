"use client";

import { useState } from "react";
import Link from "next/link";
import { accountRequest } from "@/components/account/api";
import { formatPrice } from "@/lib/products";
import {
  deliveryLabel,
  formatOrderDate,
  orderStatusLabel,
  paymentLabel,
} from "@/lib/order-status";

type FoundOrder = {
  id: string;
  number: number;
  status: string;
  total: number;
  createdAt: string;
  deliveryType: string;
  deliveryPrice: number;
  paymentOption: string;
  address: string;
  items: { title: string; size: string; quantity: number; price: number }[];
};

export function FindOrderForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<FoundOrder | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setOrder(null);
    const form = new FormData(e.currentTarget);
    try {
      const data = await accountRequest<{ order: FoundOrder }>(
        "/api/account/orders/lookup",
        {
          method: "POST",
          body: JSON.stringify({
            number: String(form.get("number") || ""),
            email: String(form.get("email") || ""),
          }),
        },
      );
      setOrder(data.order);
      setPending(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="label" htmlFor="number">
            Номер заказа
          </label>
          <input
            id="number"
            name="number"
            inputMode="numeric"
            className="field"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email из заказа
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field"
            autoComplete="email"
            required
          />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Ищем…" : "Найти заказ"}
        </button>
      </form>

      {order ? (
        <div className="border border-line bg-bg-elevated p-6">
          <p className="text-[0.72rem] tracking-[0.14em] uppercase text-ink-muted">
            Заказ #{order.number}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {orderStatusLabel(order.status)}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {formatOrderDate(order.createdAt)} · {formatPrice(order.total)}
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            {deliveryLabel(order.deliveryType)} · {paymentLabel(order.paymentOption)}
          </p>
          <p className="mt-1 text-sm">{order.address}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={`${item.title}-${item.size}`}>
                {item.title} / {item.size} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink-muted">
            Чтобы отменить заказ, сохранить адрес и смотреть историю,{" "}
            <Link href="/account/register" className="underline underline-offset-4">
              создайте кабинет
            </Link>{" "}
            на ту же почту.
          </p>
        </div>
      ) : null}
    </div>
  );
}
