import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Оформление заказа",
  description: "Оформление заказа в магазине ADASTRA.",
  path: "/checkout",
  index: false,
  follow: false,
});

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer();
  const address = customer
    ? await prisma.address.findFirst({
        where: { customerId: customer.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      })
    : null;

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="display mb-8 text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
        Оформление заказа
      </h1>
      <CheckoutForm
        prefill={
          customer
            ? {
                loggedIn: true,
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                city: address?.city || customer.city,
                address: address?.line || "",
              }
            : undefined
        }
      />
    </div>
  );
}
