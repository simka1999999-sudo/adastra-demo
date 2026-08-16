import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "О бренде ADASTRA — утеплённые комбинезоны",
  description:
    "ADASTRA — бренд утеплённых женских комбинезонов до −30 °C. Собственный сайт, доставка СДЭК и Ozon, размерный калькулятор.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "О бренде" },
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          О бренде
        </h1>
        <p className="mt-4 text-ink-muted">
          ADASTRA делает утеплённые комбинезоны для зимы: город, поездки, горы и
          прогулки. Мембрана 12 000 мм, режим до −30 °C.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 text-base leading-relaxed text-ink-muted">
        <section>
          <h2 className="text-2xl text-ink">Зачем сайт, если есть Ozon</h2>
          <p className="mt-3">
            На маркетплейсе уже {">"}2 200 отзывов и рейтинг 4.9. Свой магазин —
            это полный каталог, подбор размера, доставка СДЭК/Ozon и оплата без
            комиссии площадки.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-ink">Кто продаёт</h2>
          <p className="mt-3">
            {siteConfig.legal.fullName}, ИНН {siteConfig.legal.inn}, ОГРНИП{" "}
            {siteConfig.legal.ogrnip}. Реквизиты и адрес — на странице{" "}
            <Link href="/contacts" className="text-ink underline underline-offset-4">
              контактов
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-ink">Как заказать</h2>
          <p className="mt-3">
            Выберите модель и размер, оформите заказ без регистрации. Помощь с
            размером — в{" "}
            <Link href="/size-guide" className="text-ink underline underline-offset-4">
              калькуляторе
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
