import type { Metadata } from "next";
import Link from "next/link";
import { SizeCalculator } from "@/components/SizeCalculator";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { sizeMeasurements } from "../../../content/size";
import { sizeFaq } from "../../../content/seo/categories";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Как выбрать размер комбинезона ADASTRA",
  description:
    "Таблица размеров и подбор комбинезона ADASTRA по росту и обхватам. Размеры 42–50 RU, рост от 155 см.",
  path: "/size-guide",
});

const rows = [
  { height: "158", ru: "42", chest: "84–88", waist: "66–70", hips: "92–96" },
  { height: "164", ru: "44–46", chest: "88–96", waist: "70–78", hips: "96–104" },
  { height: "170", ru: "46", chest: "92–96", waist: "74–78", hips: "100–104" },
  { height: "176", ru: "46–48", chest: "96–100", waist: "78–82", hips: "104–108" },
];

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
          Два шага: снимите мерки и сверьте с сеткой. В линейке 11 вариантов
          (42–50 RU). Полную таблицу уточняем; при сомнении напишите нам до заказа.
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

      <div className="mt-12 overflow-x-auto border border-line bg-bg-elevated">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line text-[0.72rem] uppercase tracking-[0.12em] text-ink-muted">
            <tr>
              <th className="px-4 py-3">Рост</th>
              <th className="px-4 py-3">Размер RU</th>
              <th className="px-4 py-3">Обхват груди</th>
              <th className="px-4 py-3">Талия</th>
              <th className="px-4 py-3">Обхват бёдер</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.height} className="border-b border-line/70">
                <td className="px-4 py-3">{row.height}</td>
                <td className="px-4 py-3">{row.ru}</td>
                <td className="px-4 py-3">{row.chest}</td>
                <td className="px-4 py-3">{row.waist}</td>
                <td className="px-4 py-3">{row.hips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/catalog/kombinezony" className="btn mt-10 inline-flex">
        Смотреть комбинезоны
      </Link>

      <div className="max-w-3xl">
        <FaqSection items={sizeFaq} />
      </div>
    </div>
  );
}
