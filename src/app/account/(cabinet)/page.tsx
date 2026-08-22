import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatusLabel } from "@/lib/order-status";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Личный кабинет",
  description: "Заказы, адреса и профиль покупателя ADASTRA.",
  path: "/account",
  index: false,
  follow: false,
});

export default async function AccountHomePage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  const [orderCount, orders, addresses, wishlist] = await Promise.all([
    prisma.order.count({ where: { customerId: customer.id } }),
    prisma.order.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.address.count({ where: { customerId: customer.id } }),
    prisma.wishlistItem.count({ where: { customerId: customer.id } }),
  ]);
  const last = orders[0];

  return (
    <div>
      <h1 className="display text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.03em]">
        Обзор
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">
        Здесь ваши заказы, избранное, адреса и мерки для подбора размера.
      </p>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="border border-line bg-bg-elevated p-5">
          <dt className="text-[0.68rem] tracking-[0.14em] uppercase text-ink-muted">
            Заказы
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">
            {orderCount}
          </dd>
        </div>
        <div className="border border-line bg-bg-elevated p-5">
          <dt className="text-[0.68rem] tracking-[0.14em] uppercase text-ink-muted">
            Избранное
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">{wishlist}</dd>
        </div>
        <div className="border border-line bg-bg-elevated p-5">
          <dt className="text-[0.68rem] tracking-[0.14em] uppercase text-ink-muted">
            Адреса
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">{addresses}</dd>
        </div>
      </dl>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl">Последние заказы</h2>
          <Link href="/account/orders" className="text-sm underline underline-offset-4">
            Все заказы
          </Link>
        </div>
        {last ? (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="block border border-line bg-bg-elevated p-5 hover:border-ink"
                >
                  <p className="font-medium">Заказ #{order.number}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {formatOrderDate(order.createdAt)} ·{" "}
                    {orderStatusLabel(order.status)} · {formatPrice(order.total)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-ink-muted">
            Заказов пока нет.{" "}
            <Link href="/catalog" className="underline underline-offset-4">
              Перейти в каталог
            </Link>
          </p>
        )}
      </section>

      {!customer.sizeRu && !customer.heightCm ? (
        <p className="mt-8 border border-line bg-bg-elevated p-5 text-sm">
          Сохраните рост и размер — так проще повторять заказы.{" "}
          <Link href="/account/size" className="underline underline-offset-4">
            Заполнить мерки
          </Link>
        </p>
      ) : null}
    </div>
  );
}
