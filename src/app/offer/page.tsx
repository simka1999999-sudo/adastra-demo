import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";
import { formatPhoneDisplay, legalEntity, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Публичная оферта ADASTRA",
  description:
    "Публичная оферта интернет-магазина ADASTRA (ИП Жумаханова О.А.): условия покупки, доставки и возврата.",
  path: "/offer",
});

export default function OfferPage() {
  const legal = legalEntity;

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Публичная оферта" },
        ]}
      />
      <header className="mb-10 max-w-3xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Публичная оферта
        </h1>
        <p className="mt-4 text-ink-muted">
          Настоящий документ является официальным предложением (офертой){" "}
          {legal.shortName} (бренд ADASTRA) заключить договор розничной
          купли-продажи дистанционным способом.
        </p>
      </header>

      <article className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-ink-muted">
        <section>
          <h2 className="text-xl text-ink">1. Общие положения</h2>
          <p className="mt-3">
            1.1. Продавец — {legal.fullName}, ИНН {legal.inn}, ОГРНИП{" "}
            {legal.ogrnip}, адрес: {legal.legalAddress}. Контактный телефон{" "}
            <a
              className="text-ink underline underline-offset-4"
              href={`tel:${siteConfig.phoneRaw}`}
            >
              {formatPhoneDisplay()}
            </a>
            , email{" "}
            <a
              className="text-ink underline underline-offset-4"
              href={`mailto:${siteConfig.email}`}
            >
              {siteConfig.email}
            </a>
            .
          </p>
          <p className="mt-2">
            1.2. Покупатель — дееспособное физическое лицо, оформляющее заказ на
            сайте {siteConfig.url}.
          </p>
          <p className="mt-2">
            1.3. Акцептом оферты является оформление заказа и/или оплата товара.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">2. Предмет договора</h2>
          <p className="mt-3">
            2.1. Продавец передаёт, а Покупатель оплачивает и принимает товары,
            указанные в заказе: утеплённые комбинезоны и верхнюю одежду ADASTRA.
          </p>
          <p className="mt-2">
            2.2. Аксессуары в ассортименте интернет-магазина не представлены.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">3. Оформление и оплата</h2>
          <p className="mt-3">
            3.1. Заказ оформляется через корзину сайта. Покупатель указывает
            контакты и адрес доставки.
          </p>
          <p className="mt-2">
            3.2. Оплата — онлайн (ЮKassa) или при получении, если способ доступен
            для выбранной доставки.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">4. Доставка</h2>
          <p className="mt-3">
            4.1. Доставка осуществляется службами СДЭК и Ozon Доставка. Срок и
            стоимость рассчитываются при оформлении заказа и включаются в итоговую
            сумму.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">5. Возврат</h2>
          <p className="mt-3">
            5.1. Покупатель вправе отказаться от товара до получения, при
            вручении или в течение 14 дней после получения, если товар не был в
            употреблении, сохранены товарный вид, потребительские свойства и
            бирки.
          </p>
          <p className="mt-2">
            5.2. Подробности — на странице{" "}
            <Link
              href="/delivery"
              className="text-ink underline underline-offset-4"
            >
              Доставка и оплата
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">6. Персональные данные</h2>
          <p className="mt-3">
            6.1. Оформляя заказ или регистрируясь на сайте, Покупатель
            соглашается на обработку персональных данных в целях исполнения
            договора и коммуникации по заказу.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-ink">7. Реквизиты продавца</h2>
          <dl className="mt-4 space-y-2">
            <div>
              <dt className="inline text-ink-muted">Полное наименование: </dt>
              <dd className="inline text-ink">{legal.fullName}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">ИНН: </dt>
              <dd className="inline text-ink">{legal.inn}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">ОГРНИП: </dt>
              <dd className="inline text-ink">{legal.ogrnip}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">Юридический адрес: </dt>
              <dd className="inline text-ink">{legal.legalAddress}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">Фактический адрес: </dt>
              <dd className="inline text-ink">{legal.actualAddress}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">Телефон: </dt>
              <dd className="inline text-ink">{formatPhoneDisplay()}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">Email: </dt>
              <dd className="inline text-ink">{siteConfig.email}</dd>
            </div>
          </dl>

          <h3 className="mt-8 text-lg text-ink">Платёжные реквизиты</h3>
          <dl className="mt-4 space-y-2">
            <div>
              <dt className="inline text-ink-muted">Банк: </dt>
              <dd className="inline text-ink">{legal.bank.name}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">Расчётный счёт: </dt>
              <dd className="inline text-ink">{legal.bank.checkingAccount}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">Корр. счёт: </dt>
              <dd className="inline text-ink">
                {legal.bank.correspondentAccount}
              </dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">БИК: </dt>
              <dd className="inline text-ink">{legal.bank.bik}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">ИНН банка: </dt>
              <dd className="inline text-ink">{legal.bank.inn}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">КПП банка: </dt>
              <dd className="inline text-ink">{legal.bank.kpp}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">Юр. адрес банка: </dt>
              <dd className="inline text-ink">{legal.bank.legalAddress}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">ОКПО банка: </dt>
              <dd className="inline text-ink">{legal.bank.okpo}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">ОКТМО банка: </dt>
              <dd className="inline text-ink">{legal.bank.oktmo}</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs">
          Редакция оферты: {new Date().toLocaleDateString("ru-RU")}.
        </p>
      </article>
    </div>
  );
}
