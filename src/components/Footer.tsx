import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { formatPhoneDisplay, siteConfig, socialNav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="relative h-12 w-64">
            <Image
              src="/brand/logo-wordmark-light.png"
              alt="ADASTRA"
              fill
              className="object-contain object-left"
              sizes="256px"
            />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            Утеплённые комбинезоны: Thinsulate, Omniheat, мембрана 12 000 мм,
            от −5 до −30 °C. Доставка СДЭК и Ozon.
          </p>
          <p className="mt-5 text-sm">
            <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-white/80">
              {formatPhoneDisplay()}
            </a>
          </p>
          <p className="mt-1 text-xs text-white/45">{siteConfig.hours}</p>
          <p className="mt-3 text-xs leading-relaxed text-white/45">
            {siteConfig.legal.shortName}
            <br />
            ИНН {siteConfig.legal.inn} · ОГРНИП {siteConfig.legal.ogrnip}
          </p>
        </div>
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-white/40">
            Каталог
          </p>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/catalog/${c.slug}`}
                  className="transition-colors hover:text-white"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-white/40">
            Покупателям
          </p>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            <li>
              <Link href="/size-guide" className="transition-colors hover:text-white">
                Как выбрать размер
              </Link>
            </li>
            <li>
              <Link href="/delivery" className="transition-colors hover:text-white">
                Доставка и оплата
              </Link>
            </li>
            <li>
              <Link href="/returns" className="transition-colors hover:text-white">
                Возврат и обмен
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="transition-colors hover:text-white">
                Контакты
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-white">
                О бренде
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="transition-colors hover:text-white">
                Отзывы
              </Link>
            </li>
            <li>
              <Link href="/offer" className="transition-colors hover:text-white">
                Публичная оферта
              </Link>
            </li>
            <li>
              <Link href="/partners" className="transition-colors hover:text-white">
                Партнёрам
              </Link>
            </li>
            <li>
              <Link href="/account" className="transition-colors hover:text-white">
                Личный кабинет
              </Link>
            </li>
            <li>
              <Link href="/account/find" className="transition-colors hover:text-white">
                Найти заказ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-white/40">
            Соцсети
          </p>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            {socialNav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/40 sm:flex-row sm:justify-between">
          <span>© ADASTRA {new Date().getFullYear()}</span>
          <span>СДЭК · Ozon Доставка · Без аксессуаров в каталоге</span>
        </div>
      </div>
    </footer>
  );
}
