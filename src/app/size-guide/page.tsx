import type { Metadata } from "next";
import Link from "next/link";
import { SizeCalculator } from "@/components/SizeCalculator";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import {
  brandSizes,
  cmRange,
  heightGrades,
  sizeMeasurements,
} from "../../../content/size";
import { sizeFaq } from "../../../content/seo/categories";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Как выбрать размер комбинезона ADASTRA",
  description:
    "Таблица размеров комбинезона ADASTRA: S–XL, 42–50 RU, ростовки 158–176. Обхват груди, бёдер и рост.",
  path: "/size-guide",
});

export default function SizeGuidePage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Как выбрать размер" },
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Как выбрать размер
        </h1>
        <p className="mt-4 text-ink-muted">
          Снимите мерки и сверьте с сеткой: размер бренда S–XL (42–50 RU) и
          ростовка 158–176. Если не уверены — напишите нам до заказа.
        </p>
      </header>

      <section className="border border-line bg-bg-elevated p-6 md:p-8">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
          Шаг 1
        </p>
        <h2 className="display mt-3 text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.03em]">
          Снимите мерки
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-3">
          {sizeMeasurements.map((item) => (
            <div key={item.title}>
              <dt className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-ink-muted">
                {item.title}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <SizeCalculator />

      <section className="mt-12 space-y-8">
        <div className="overflow-x-auto border border-line bg-bg-elevated">
          <div className="border-b border-line px-4 py-4 md:px-6">
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
              Размер
            </p>
            <h2 className="mt-2 text-xl tracking-tight">
              Обхваты груди и бёдер
            </h2>
          </div>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-[0.72rem] uppercase tracking-[0.12em] text-ink-muted">
              <tr>
                <th className="px-4 py-3 md:px-6">Параметр</th>
                {brandSizes.map((size) => (
                  <th key={size.id} className="px-4 py-3">
                    {size.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line/70">
                <th className="px-4 py-3 font-medium md:px-6">
                  Российский размер
                </th>
                {brandSizes.map((size) => (
                  <td key={size.id} className="px-4 py-3">
                    {size.ru}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-line/70">
                <th className="px-4 py-3 font-medium md:px-6">
                  Обхват груди, см
                </th>
                {brandSizes.map((size) => (
                  <td key={size.id} className="px-4 py-3">
                    {cmRange(size.chestMin, size.chestMax)}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium md:px-6">
                  Обхват бёдер, см
                </th>
                {brandSizes.map((size) => (
                  <td key={size.id} className="px-4 py-3">
                    {cmRange(size.hipsMin, size.hipsMax)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto border border-line bg-bg-elevated">
          <div className="border-b border-line px-4 py-4 md:px-6">
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
              Рост
            </p>
            <h2 className="mt-2 text-xl tracking-tight">Ростовка комбинезона</h2>
          </div>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-[0.72rem] uppercase tracking-[0.12em] text-ink-muted">
              <tr>
                <th className="px-4 py-3 md:px-6">Параметр</th>
                {heightGrades.map((grade) => (
                  <th key={grade.id} className="px-4 py-3">
                    {grade.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="px-4 py-3 font-medium md:px-6">Рост, см</th>
                {heightGrades.map((grade) => (
                  <td key={grade.id} className="px-4 py-3">
                    {cmRange(grade.min, grade.max)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside className="mt-10 border border-line bg-bg-elevated p-6 md:p-8">
        <h2 className="text-xl tracking-tight">Если не уверены в размере</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          Напишите нам — подскажем размер и ростовку до заказа.
        </p>
        <p className="mt-5">
          <Link href="/contacts" className="chip">
            Написать нам
          </Link>
        </p>
      </aside>

      <Link href="/catalog/kombinezony" className="btn mt-10 inline-flex">
        Смотреть комбинезоны
      </Link>

      <div className="max-w-3xl">
        <FaqSection items={sizeFaq} />
      </div>
    </div>
  );
}
