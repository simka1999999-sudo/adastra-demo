import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getProductById } from "@/lib/catalog-query";
import { formatPrice, storefrontImages } from "@/lib/products";
import {
  canCancelOrder,
  deliveryLabel,
  formatOrderDate,
  orderStatusLabel,
  paymentLabel,
} from "@/lib/order-status";
import {
  CancelOrderButton,
  ReorderButton,
} from "@/components/account/OrderActions";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = buildPageMetadata({
  title: "Заказ",
  description: "Детали заказа ADASTRA.",
  path: "/account/orders",
  index: false,
  follow: false,
});

export default async function AccountOrderPage({ params }: Props) {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, customerId: customer.id },
    include: { items: true },
  });
  if (!order) notFound();

  const reorderItems = order.items.map((item) => {
    const product = getProductById(item.productId);
    return {
      productId: item.productId,
      slug: item.slug,
      title: item.title,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      image: product ? storefrontImages(product)[0] || "" : "",
    };
  });

  return (
    <div>
      <p className="text-sm text-ink-muted">
        <Link href="/account/orders" className="underline underline-offset-4">
          Все заказы
        </Link>
      </p>
      <h1 className="display mt-3 text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.03em]">
        Заказ #{order.number}
      </h1>
      <p className="mt-3 text-ink-muted">
        {formatOrderDate(order.createdAt)} · {orderStatusLabel(order.status)}
      </p>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-baseline justify-between gap-3 py-4"
          >
            <div>
              <Link
                href={`/catalog/${item.slug}`}
                className="font-medium underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">
                Размер {item.size} · {item.quantity} шт.
              </p>
            </div>
            <p className="tabular-nums">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-8 max-w-lg space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Доставка</dt>
          <dd>
            {deliveryLabel(order.deliveryType)} · {formatPrice(order.deliveryPrice)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Оплата</dt>
          <dd>{paymentLabel(order.paymentOption)}</dd>
        </div>
        <div className="flex justify-between gap-4 text-base font-semibold">
          <dt>Итого</dt>
          <dd className="tabular-nums">{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-8 space-y-2 text-sm">
        <p>
          <span className="text-ink-muted">Получатель: </span>
          {order.name}, {order.phone}
        </p>
        <p>
          <span className="text-ink-muted">Адрес: </span>
          {order.address}
        </p>
        {order.comment ? (
          <p>
            <span className="text-ink-muted">Комментарий: </span>
            {order.comment}
          </p>
        ) : null}
      </div>

      {order.paymentOption === "online" &&
      order.status === "awaiting_payment" &&
      order.paymentUrl ? (
        <p className="mt-6">
          <a href={order.paymentUrl} className="btn inline-flex">
            Оплатить заказ
          </a>
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ReorderButton items={reorderItems} />
        {canCancelOrder(order.status) ? (
          <CancelOrderButton orderId={order.id} />
        ) : null}
      </div>
    </div>
  );
}
