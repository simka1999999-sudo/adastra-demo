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

export function CheckoutForm({
  prefill,
}: {
  prefill?: {
    loggedIn: boolean;
    name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
  };
}) {
  const router = useRouter();
  const { items, total, ready, clear } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [carrier, setCarrier] = useState<DeliveryCarrier>("cdek");
  const [city, setCity] = useState(prefill?.city ?? "");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

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
      password: String(form.get("password") || "") || undefined,
      saveAddress: form.get("saveAddress") === "on",
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
        {prefill?.loggedIn ? (
          <p className="text-sm text-ink-muted">
            Данные из кабинета.{" "}
            <Link href="/account" className="underline underline-offset-4">
              Изменить профиль
            </Link>
          </p>
        ) : (
          <p className="text-sm text-ink-muted">
            Уже покупали?{" "}
            <Link
              href="/account/login?next=/checkout"
              className="underline underline-offset-4"
            >
              Войти
            </Link>
            , чтобы не заполнять заново.
          </p>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              ФИО
            </label>
            <input
              id="name"
              name="name"
              className="field"
              autoComplete="name"
              defaultValue={prefill?.name}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Телефон
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              className="field"
              autoComplete="tel"
              defaultValue={prefill?.phone}
              required
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">
            Почта
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field"
            autoComplete="email"
            defaultValue={prefill?.email}
            required
          />
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
            autoComplete="address-level2"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="address">
            Адрес / ПВЗ
          </label>
          <input
            id="address"
            name="address"
            className="field"
            autoComplete="street-address"
            defaultValue={prefill?.address}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="comment">
            Комментарий <span className="font-normal normal-case tracking-normal">(необязательно)</span>
          </label>
          <textarea id="comment" name="comment" className="field min-h-28" />
        </div>

        <fieldset className="space-y-2">
          <legend className="label">Доставка</legend>
          <label className="choice">
            <input
              type="radio"
              name="deliveryType"
              value="cdek"
              checked={carrier === "cdek"}
              onChange={() => setCarrier("cdek")}
            />
            <span>
              <span className="block font-medium">СДЭК</span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                ПВЗ или курьер
              </span>
            </span>
          </label>
          <label className="choice">
            <input
              type="radio"
              name="deliveryType"
              value="ozon"
              checked={carrier === "ozon"}
              onChange={() => setCarrier("ozon")}
            />
            <span>
              <span className="block font-medium">Ozon Доставка</span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                Пункты выдачи Ozon
              </span>
            </span>
          </label>
          {quoteLoading ? (
            <p className="text-sm text-ink-muted">Считаем доставку…</p>
          ) : quote ? (
            <p className="text-sm text-ink-muted">
              {quote.label}: {formatPrice(quote.price)} · {quote.daysMin}–
              {quote.daysMax} дн.
              {quote.note ? ` (${quote.note})` : ""}
            </p>
          ) : null}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="label">Оплата</legend>
          <label className="choice">
            <input type="radio" name="paymentOption" value="cod" defaultChecked />
            <span>
              <span className="block font-medium">При получении</span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                Наличными или картой в ПВЗ
              </span>
            </span>
          </label>
          <label className="choice">
            <input type="radio" name="paymentOption" value="online" />
            <span>
              <span className="block font-medium">Онлайн</span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                ЮKassa на следующем шаге
              </span>
            </span>
          </label>
        </fieldset>

        {prefill?.loggedIn ? (
          <label className="choice items-center">
            <input type="checkbox" name="saveAddress" className="mt-0.5" defaultChecked />
            <span className="text-sm">Сохранить адрес в кабинете</span>
          </label>
        ) : (
          <>
            <label className="choice items-center">
              <input
                type="checkbox"
                name="createAccount"
                className="mt-0.5"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
              />
              <span className="text-sm">Создать кабинет для следующих заказов</span>
            </label>
            {createAccount ? (
              <div>
                <label className="label" htmlFor="password">
                  Пароль для кабинета
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="field"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            ) : null}
          </>
        )}

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

      <aside className="h-fit border border-line bg-bg-elevated p-6 lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
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
