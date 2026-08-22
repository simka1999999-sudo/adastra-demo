import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatusLabel } from "@/lib/order-status";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Заказ оформлен",
  description: "Заказ в магазине ADASTRA успешно оформлен.",
  path: "/order/success",
  index: false,
  follow: false,
});

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const customer = await getCurrentCustomer();
  const order = id
    ? await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      })
    : null;
  const ownOrder = Boolean(
    order && customer && order.customerId === customer.id,
  );

  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Спасибо за заказ!
        </h1>
        {order ? (
          <p className="mt-5 text-ink-muted">
            Заказ #{order.number} · {orderStatusLabel(order.status)} ·{" "}
            {formatPrice(order.total)}
            <br />
            {formatOrderDate(order.createdAt)}. Мы свяжемся для подтверждения.
          </p>
        ) : (
          <p className="mt-5 text-ink-muted">
            Мы получили заявку и свяжемся с вами для подтверждения.
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {ownOrder && order ? (
            <Link href={`/account/orders/${order.id}`} className="btn inline-flex">
              Открыть в кабинете
            </Link>
          ) : customer ? (
            <Link href="/account/orders" className="btn inline-flex">
              Мои заказы
            </Link>
          ) : (
            <Link href="/account/register" className="btn inline-flex">
              Создать кабинет
            </Link>
          )}
          <Link href="/catalog" className="btn-ghost btn inline-flex">
            В каталог
          </Link>
        </div>
        {!customer && order ? (
          <p className="mt-6 text-sm text-ink-muted">
            Следить без регистрации:{" "}
            <Link href="/account/find" className="underline underline-offset-4">
              найти заказ
            </Link>{" "}
            по номеру {order.number} и почте.
          </p>
        ) : null}
      </div>
    </div>
  );
}
