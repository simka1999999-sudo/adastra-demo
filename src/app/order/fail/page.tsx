import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Оплата не завершена",
  description: "Оплата заказа ADASTRA не завершена.",
  path: "/order/fail",
  index: false,
  follow: false,
});

export default function OrderFailPage() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">Оплата не прошла</h1>
        <p className="mt-5 text-ink-muted">
          Можно попробовать ещё раз или выбрать оплату при получении.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/checkout" className="btn">
            Вернуться к оформлению
          </Link>
          <Link href="/cart" className="btn btn-ghost">
            В корзину
          </Link>
        </div>
      </div>
    </div>
  );
}
