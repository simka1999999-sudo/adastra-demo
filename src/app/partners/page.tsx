import type { Metadata } from "next";
import { siteConfig, formatPhoneDisplay } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Партнёрам — оптовые закупки ADASTRA",
  description:
    "Оптовые закупки и партнёрство с брендом ADASTRA: комбинезоны и утеплённая одежда для магазинов и шоурумов.",
  path: "/partners",
});

export default function PartnersPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Партнёрам" },
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
          B2B
        </p>
        <h1 className="display mt-3 text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Партнёрам
        </h1>
        <p className="mt-4 text-ink-muted">
          Оптовые закупки утеплённых комбинезонов и верхней одежды ADASTRA для
          розницы, шоурумов и маркетплейсов.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 text-base leading-relaxed text-ink-muted">
          <h2 className="text-xl text-ink">Что предлагаем</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Оптовые партии комбинезонов и верхней одежды</li>
            <li>Актуальные размеры и цвета сезона</li>
            <li>Материалы для витрины и контент бренда</li>
            <li>Сопровождение по ассортименту и посадке</li>
          </ul>
          <p>
            Аксессуары в оптовой линейке не входят — фокус на верхней одежде и
            комбинезонах.
          </p>
        </div>
        <div className="border border-line bg-bg-elevated p-6 md:p-8">
          <h2 className="text-xl">Связаться по опту</h2>
          <p className="mt-3 text-sm text-ink-muted">
            Укажите город, формат точки и интересующие категории — ответим с
            условиями и прайсом.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              Телефон:{" "}
              <a
                className="font-semibold underline underline-offset-4"
                href={`tel:${siteConfig.phoneRaw}`}
              >
                {formatPhoneDisplay()}
              </a>
            </li>
            <li>
              Email:{" "}
              <a
                className="font-semibold underline underline-offset-4"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              Telegram:{" "}
              <a
                className="font-semibold underline underline-offset-4"
                href={siteConfig.social.telegram}
                target="_blank"
                rel="noreferrer"
              >
                написать
              </a>
            </li>
            <li>
              Max:{" "}
              <a
                className="font-semibold underline underline-offset-4"
                href={siteConfig.social.max}
                target="_blank"
                rel="noreferrer"
              >
                написать
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
