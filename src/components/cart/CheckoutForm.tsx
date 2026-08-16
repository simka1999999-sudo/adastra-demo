"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/products";
import { trackBeginCheckout, trackPurchase } from "@/lib/metrika";
import {
  quoteDeliveryLocal,
  type DeliveryCarrier,
} from "@/lib/delivery";
import {
  formatPhoneDisplay,
  siteConfig,
  withBasePath,
} from "@/lib/site";

type Quote = {
  carrier: DeliveryCarrier;
  label: string;
  price: number;
  daysMin: number;
  daysMax: number;
  note?: string;
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, ready, clear } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [carrier, setCarrier] = useState<DeliveryCarrier>("cdek");
  const [city, setCity] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setQuoteLoading(true);
      try {
        if (siteConfig.isStaticDemo) {
          if (!cancelled) setQuote(quoteDeliveryLocal({ carrier, city }));
          return;
        }
        const res = await fetch(withBasePath("/api/delivery/quote"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carrier, city }),
        });
        const data = (await res.json()) as { ok?: boolean; quote?: Quote };
        if (!cancelled && data.ok && data.quote) setQuote(data.quote);
        else if (!cancelled) setQuote(quoteDeliveryLocal({ carrier, city }));
      } catch {
        if (!cancelled) setQuote(quoteDeliveryLocal({ carrier, city }));
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [carrier, city]);

  if (!ready) return <p className="text-ink-muted">Загрузка…</p>;
  if (!items.length) {
    return (
      <p className="text-ink-muted">
        Корзина пуста. Добавьте товары перед оформлением.
      </p>
    );
  }

  const deliveryPrice = quote?.price ?? 0;
  const grandTotal = total + deliveryPrice;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      address: String(form.get("address") || ""),
      city,
      comment: String(form.get("comment") || ""),
      deliveryType: carrier,
      deliveryPrice,
      paymentOption: String(form.get("paymentOption") || "cod"),
      createAccount: form.get("createAccount") === "on",
      items,
    };

    const ecommerceProducts = items.map((item) => ({
      id: item.productId,
      name: item.title,
      price: item.price,
      variant: item.sizeLabel,
      quantity: item.quantity,
    }));
    trackBeginCheckout(ecommerceProducts, grandTotal);

    if (siteConfig.isStaticDemo) {
      setError(
        `Это демо-витрина: заказы не отправляются. Позвоните ${formatPhoneDisplay()} или напишите в Telegram.`,
      );
      setPending(false);
      return;
    }

    try {
      const res = await fetch(withBasePath("/api/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        orderId?: string;
        paymentUrl?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Не удалось оформить заказ");
      }
      trackPurchase(data.orderId || "unknown", ecommerceProducts, grandTotal);
      clear();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      router.push(`/order/success?id=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка оформления");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <div>
          <label className="label" htmlFor="name">
            ФИО
          </label>
          <input id="name" name="name" className="field" required />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Телефон
          </label>
          <input id="phone" name="phone" type="tel" className="field" required />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Почта
          </label>
          <input id="email" name="email" type="email" className="field" required />
        </div>
        <div>
          <label className="label" htmlFor="city">
            Город
          </label>
          <input
            id="city"
            name="city"
            className="field"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Москва"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="address">
            Адрес / ПВЗ
          </label>
          <input id="address" name="address" className="field" required />
        </div>
        <div>
          <label className="label" htmlFor="comment">
            Комментарий
          </label>
          <textarea id="comment" name="comment" className="field min-h-28" />
        </div>

        <fieldset className="space-y-3">
          <legend className="label">Доставка</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="deliveryType"
              value="cdek"
              checked={carrier === "cdek"}
              onChange={() => setCarrier("cdek")}
            />
            СДЭК — ПВЗ / курьер
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="deliveryType"
              value="ozon"
              checked={carrier === "ozon"}
              onChange={() => setCarrier("ozon")}
            />
            Ozon Доставка
          </label>
          {quoteLoading ? (
            <p className="text-xs text-ink-muted">Считаем доставку…</p>
          ) : quote ? (
            <p className="text-xs text-ink-muted">
              {quote.label}: {formatPrice(quote.price)} · {quote.daysMin}–
              {quote.daysMax} дн.
              {quote.note ? ` (${quote.note})` : ""}
            </p>
          ) : null}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="label">Оплата</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="paymentOption" value="cod" defaultChecked />
            Оплата при получении
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="paymentOption" value="online" />
            Оплата онлайн (ЮKassa)
          </label>
        </fieldset>

        <label className="flex items-start gap-2 text-sm text-ink-muted">
          <input type="checkbox" name="createAccount" className="mt-1" defaultChecked />
          Сохранить мои данные (регистрация покупателя)
        </label>

        {siteConfig.isStaticDemo ? (
          <p className="border border-line bg-bg-elevated p-4 text-sm text-ink-muted">
            Демо на GitHub Pages без сервера оплаты. Чтобы заказать —{" "}
            <a className="underline underline-offset-4 text-ink" href={`tel:${siteConfig.phoneRaw}`}>
              {formatPhoneDisplay()}
            </a>
            {" · "}
            <a
              className="underline underline-offset-4 text-ink"
              href={siteConfig.social.telegram}
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
            .
          </p>
        ) : null}
        <p className="text-xs text-ink-muted">
          Нажимая «Оформить заказ», вы соглашаетесь с{" "}
          <Link href="/offer" className="underline underline-offset-4">
            публичной офертой
          </Link>
          .
        </p>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </div>

      <aside className="h-fit border border-line bg-bg-elevated p-6">
        <p className="text-[0.72rem] tracking-[0.14em] uppercase text-ink-muted">
          Итого
        </p>
        <ul className="mt-4 space-y-2 text-sm text-ink-muted">
          {items.map((i) => (
            <li key={`${i.productId}-${i.sizeId}`}>
              {i.title} × {i.quantity}
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Товары</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Доставка</dt>
            <dd>{quoteLoading ? "…" : formatPrice(deliveryPrice)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-base font-semibold">
            <dt>К оплате</dt>
            <dd className="text-2xl">{formatPrice(grandTotal)}</dd>
          </div>
        </dl>
        <button type="submit" className="btn mt-6 w-full" disabled={pending || quoteLoading}>
          {pending ? "Оформляем…" : "Оформить заказ"}
        </button>
      </aside>
    </form>
  );
}
