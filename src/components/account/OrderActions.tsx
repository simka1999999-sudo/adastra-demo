"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { accountRequest } from "@/components/account/api";
import type { CartItem } from "@/lib/types";

type OrderItem = {
  productId: string;
  slug: string;
  title: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
};

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onClick() {
    if (!window.confirm("Отменить этот заказ?")) return;
    setPending(true);
    setError("");
    try {
      await accountRequest(`/api/account/orders/${orderId}/cancel`, {
        method: "POST",
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn-ghost btn"
        disabled={pending}
        onClick={() => void onClick()}
      >
        {pending ? "Отменяем…" : "Отменить заказ"}
      </button>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}

export function ReorderButton({ items }: { items: OrderItem[] }) {
  const router = useRouter();
  const { addItem } = useCart();

  function onClick() {
    for (const item of items) {
      addItem({
        productId: item.productId,
        slug: item.slug,
        title: item.title,
        price: item.price,
        sizeId: item.size,
        sizeLabel: item.size,
        quantity: item.quantity,
        image: item.image || "",
      } satisfies CartItem);
    }
    router.push("/cart");
  }

  return (
    <button type="button" className="btn" onClick={onClick}>
      Повторить заказ
    </button>
  );
}
