import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { deliveryFaq } from "../../../content/seo/categories";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Доставка СДЭК и Ozon — оплата ADASTRA",
  description:
    "Доставка комбинезонов ADASTRA через СДЭК и Ozon Доставка. Стоимость считается при оформлении заказа. Оплата онлайн или при получении.",
  path: "/delivery",
});

export default function DeliveryPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Доставка и оплата" },
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Доставка и оплата
        </h1>
        <p className="mt-4 text-ink-muted">
          Доставка — СДЭК и Ozon Доставка. При оформлении заказа сразу видна
          сумма товаров + доставка.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed">
        <section>
          <h2 className="text-2xl">СДЭК</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
            <li>Доставка до ПВЗ или курьером до двери.</li>
            <li>Срок и стоимость зависят от города получателя.</li>
            <li>Тариф рассчитывается в корзине при оформлении.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">Ozon Доставка</h2>
          <p className="mt-4 text-ink-muted">
            Отправка через Ozon Логистика: пункты выдачи и курьерская доставка
            Ozon. Интеграция по API Seller — стоимость показывается на шаге
            оформления заказа.
          </p>
        </section>

        <section>
          <h2 className="text-2xl">Оплата</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
            <li>Онлайн на сайте (ЮKassa).</li>
            <li>При получении — если доступно для выбранного способа доставки.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">Возврат</h2>
          <p className="mt-4 text-ink-muted">
            Отказ до получения, при вручении или в течение 14 дней после — при
            сохранении товарного вида и бирок. Условия — в{" "}
            <Link href="/returns" className="underline underline-offset-4 text-ink">
              правилах возврата
            </Link>{" "}
            и{" "}
            <Link href="/offer" className="underline underline-offset-4 text-ink">
              публичной оферте
            </Link>
            .
          </p>
        </section>

        <FaqSection items={deliveryFaq} />
      </div>
    </div>
  );
}
