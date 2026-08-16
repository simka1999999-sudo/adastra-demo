import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Заказ оформлен",
  description: "Заказ в магазине ADASTRA успешно оформлен.",
  path: "/order/success",
  index: false,
  follow: false,
});

export default function OrderSuccessPage() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">Спасибо за заказ!</h1>
        <p className="mt-5 text-ink-muted">
          Мы получили заявку и свяжемся с вами для подтверждения.
        </p>
        <Link href="/catalog" className="btn mt-8 inline-flex">
          Вернуться в каталог
        </Link>
      </div>
    </div>
  );
}
