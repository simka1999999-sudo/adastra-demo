import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatusLabel } from "@/lib/order-status";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Мои заказы",
  description: "История заказов в магазине ADASTRA.",
  path: "/account/orders",
  index: false,
  follow: false,
});

export default async function AccountOrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="display text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.03em]">
        Заказы
      </h1>
      {orders.length ? (
        <ul className="mt-8 space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="block border border-line bg-bg-elevated p-5 hover:border-ink"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-medium">Заказ #{order.number}</p>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {formatOrderDate(order.createdAt)} · {orderStatusLabel(order.status)}
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  {order.items
                    .map((item) => `${item.title} × ${item.quantity}`)
                    .join(", ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-ink-muted">
          Пока пусто.{" "}
          <Link href="/catalog" className="underline underline-offset-4">
            Смотреть комбинезоны
          </Link>
        </p>
      )}
    </div>
  );
}
