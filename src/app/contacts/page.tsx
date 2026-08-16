import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { formatPhoneDisplay, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Контакты ADASTRA — телефон, адрес, реквизиты",
  description:
    "Контакты интернет-магазина ADASTRA: телефон, почта, адрес в Москве, реквизиты ИП Жумаханова, время работы.",
  path: "/contacts",
});

export default function ContactsPage() {
  const legal = siteConfig.legal;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    image: `${siteConfig.url}/brand/logo-mark-dark.png`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: siteConfig.url,
    openingHours: "Mo-Su 10:00-20:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Большая Почтовая, д. 32, 28",
      addressLocality: "Москва",
      postalCode: "105082",
      addressCountry: "RU",
    },
    taxID: legal.inn,
  };

  return (
    <div className="container-page py-10 md:py-14">
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Контакты" },
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Контакты
        </h1>
        <p className="mt-4 text-ink-muted">
          Отвечаем {siteConfig.hours}. Заказ на сайте — без обязательной
          регистрации.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-xl">Связь</h2>
          <p>
            Телефон:{" "}
            <a href={`tel:${siteConfig.phoneRaw}`} className="underline underline-offset-4">
              {formatPhoneDisplay()}
            </a>
          </p>
          <p>
            Почта:{" "}
            <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
              {siteConfig.email}
            </a>
          </p>
          <p>Время работы: {siteConfig.hours}</p>
          <p>
            Адрес: {legal.actualAddress}
          </p>
          <p>
            <a
              href="https://yandex.ru/maps/?text=Москва,+Большая+Почтовая,+32"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Открыть на Яндекс Картах
            </a>
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl">Реквизиты</h2>
          <p>{legal.fullName}</p>
          <p>ИНН {legal.inn}</p>
          <p>ОГРНИП {legal.ogrnip}</p>
          <p>Юридический адрес: {legal.legalAddress}</p>
          <p>
            Банк {legal.bank.name}, р/с {legal.bank.checkingAccount}, БИК{" "}
            {legal.bank.bik}
          </p>
        </section>
      </div>
    </div>
  );
}
