import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { HeroBanner } from "@/components/HeroBanner";
import { Reveal } from "@/components/Reveal";
import { featuresCompact, useCases } from "../../content/home";
import { instagramHandle, instagramPosts } from "../../content/instagram";
import { ozonReviews, ozonReviewsMeta } from "../../content/reviews";
import { getFeaturedProducts, getFromPrice } from "@/lib/catalog-query";
import { buildPageMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/products";
import { siteConfig } from "@/lib/site";

const fromOveralls = getFromPrice("overalls");

export const metadata: Metadata = buildPageMetadata({
  title: "ADASTRA — бренд утеплённой женской одежды",
  description: `Утеплённые комбинезоны ADASTRA от −5 до −30 °C, от ${formatPrice(fromOveralls)}. Thinsulate, Omniheat, мембрана 12 000 мм. Доставка СДЭК и Ozon по России.`,
  path: "/",
  image: "/lookbook/hero-check.jpg",
});

export default function HomePage() {
  const featured = getFeaturedProducts();
  const fromPrice = fromOveralls;

  return (
    <>
      <HeroBanner fromPrice={fromPrice} />

      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...featuresCompact, ...featuresCompact].map((item, i) => (
            <span key={`${item.title}-${i}`}>
              {item.title}: {item.value}
            </span>
          ))}
        </div>
      </div>

      <section className="container-page py-16 md:py-24">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
                Сценарии
              </p>
              <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)] tracking-[-0.04em]">
                Один комбинезон — разные зимы
              </h2>
            </div>
            <p className="max-w-md text-sm text-ink-muted md:text-base">
              Комбинезоны ADASTRA работают в городе, в поездках, в горах и на
              прогулках с детьми.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item, i) => (
            <Reveal key={item.id} delay={i * 70}>
              <div className="h-full bg-bg">
                <div className="relative aspect-[4/3] overflow-hidden bg-ice">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="px-5 py-6 md:px-6">
                  <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-frost-deep">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-xl tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {item.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-bg-elevated/60 py-14 md:py-16">
        <div className="container-page">
          <Reveal>
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
              Особенности
            </p>
            <h2 className="display mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] tracking-[-0.04em]">
              Коротко о главном
            </h2>
          </Reveal>
          <dl className="mt-8 grid grid-cols-2 gap-px bg-line md:grid-cols-3 lg:grid-cols-4">
            {featuresCompact.map((f) => (
              <div key={f.title} className="bg-bg px-4 py-5">
                <dt className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-ink-muted">
                  {f.title}
                </dt>
                <dd className="mt-2 text-lg font-semibold tracking-tight">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <Reveal>
          <div className="mb-10">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
                Хиты
              </p>
              <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)] tracking-[-0.04em]">
                Самые популярные комбинезоны
              </h2>
            </div>
            <CategoryNav className="mt-6" />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
        <p className="mt-10">
          <Link href="/catalog/kombinezony" className="btn btn-ghost">
            Все комбинезоны
          </Link>
        </p>
      </section>

      <section className="border-y border-line py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <div className="mb-10">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
                  Ozon
                </p>
                <h2 className="display mt-3 text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-[-0.04em]">
                  {ozonReviewsMeta.totalLabel}
                </h2>
                <p className="mt-3 text-sm text-ink-muted">
                  Средняя оценка {ozonReviewsMeta.averageRating} · более{" "}
                  {ozonReviewsMeta.reviewsCountApprox.toLocaleString("ru-RU")}{" "}
                  отзывов
                </p>
              </div>
              <p className="mt-6">
                <Link href="/reviews" className="chip">
                  Все отзывы
                </Link>
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ozonReviews.map((r) => (
              <blockquote
                key={r.id}
                className="border border-line bg-bg-elevated/70 p-5"
              >
                <p className="text-sm leading-relaxed text-ink-muted">
                  «{r.text}»
                </p>
                <footer className="mt-4 text-xs font-semibold tracking-[0.12em] uppercase">
                  {r.author}
                  {r.context ? (
                    <span className="text-ink-muted"> · {r.context}</span>
                  ) : null}
                </footer>
              </blockquote>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <a
              href={siteConfig.ozonShopUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Смотреть отзывы на Ozon
            </a>
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <Reveal>
            <div className="mb-8">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
                  Instagram
                </p>
                <h2 className="display mt-3 text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-[-0.04em]">
                  @{instagramHandle}
                </h2>
              </div>
              <p className="mt-6">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="chip"
                >
                  Открыть профиль
                </a>
              </p>
            </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden bg-ice"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
