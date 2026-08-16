import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Оформление заказа",
  description: "Оформление заказа в магазине ADASTRA.",
  path: "/checkout",
  index: false,
  follow: false,
});

export default function CheckoutPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="display mb-8 text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
        Оформление заказа
      </h1>
      <CheckoutForm />
    </div>
  );
}
