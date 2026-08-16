import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Корзина",
  description: "Корзина интернет-магазина ADASTRA.",
  path: "/cart",
  index: false,
  follow: false,
});

export default function CartPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="display mb-8 text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
        Корзина
      </h1>
      <CartView />
    </div>
  );
}
