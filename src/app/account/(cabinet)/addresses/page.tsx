import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { AddressBook } from "@/components/account/AddressBook";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Адреса доставки",
  description: "Сохранённые адреса покупателя ADASTRA.",
  path: "/account/addresses",
  index: false,
  follow: false,
});

export default async function AddressesPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  const addresses = await prisma.address.findMany({
    where: { customerId: customer.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="display text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.03em]">
        Адреса
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">
        Основной адрес подставится при оформлении заказа.
      </p>
      <div className="mt-8">
        <AddressBook
          initial={addresses}
          defaults={{
            recipient: customer.name,
            phone: customer.phone,
            city: customer.city,
          }}
        />
      </div>
    </div>
  );
}
