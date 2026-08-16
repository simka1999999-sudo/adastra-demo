import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";
import { formatPhoneDisplay, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Возврат и обмен ADASTRA — 14 дней",
  description:
    "Возврат комбинезона ADASTRA: отказ до получения, при вручении или в течение 14 дней при сохранённом виде и бирках.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Возврат и обмен" },
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Возврат и обмен
        </h1>
        <p className="mt-4 text-ink-muted">
          Закон о защите прав потребителей: 14 дней на возврат товара надлежащего
          качества, если сохранены вид, бирки и комплектация.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 text-base leading-relaxed text-ink-muted">
        <section>
          <h2 className="text-2xl text-ink">Когда можно вернуть</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>До получения — отмена заказа.</li>
            <li>При вручении курьером — отказ от посылки.</li>
            <li>В течение 14 дней после получения — обмен или возврат денег.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl text-ink">Как оформить</h2>
          <p className="mt-3">
            Напишите на{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-ink underline underline-offset-4">
              {siteConfig.email}
            </a>{" "}
            или позвоните{" "}
            <a href={`tel:${siteConfig.phoneRaw}`} className="text-ink underline underline-offset-4">
              {formatPhoneDisplay()}
            </a>
            . Укажите номер заказа и причину.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-ink">Полные условия</h2>
          <p className="mt-3">
            Юридические формулировки — в{" "}
            <Link href="/offer" className="text-ink underline underline-offset-4">
              публичной оферте
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
