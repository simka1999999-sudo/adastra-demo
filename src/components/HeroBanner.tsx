"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";

const slides = [
  {
    src: "/lookbook/hero-slide-check-crane.jpg",
    alt: "ADASTRA — клетка и комбинезон с журавлями",
    focus: "object-[22%_center] md:object-center",
  },
  {
    src: "/lookbook/hero-slide-magenta.jpg",
    alt: "ADASTRA — лыжный комбинезон и подтяжки с логотипом",
    focus: "object-center",
  },
  {
    src: "/lookbook/hero-slide-leo.jpg",
    alt: "ADASTRA — комбинезон с леопардом",
    focus: "object-[28%_center] md:object-center",
  },
];

export function HeroBanner({ fromPrice }: { fromPrice: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="home-hero" className="relative -mt-[var(--header-h)] min-h-[100svh] overflow-hidden bg-ink text-white">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          fill
          priority={i === 0}
          quality={95}
          unoptimized
          className={`hero-media h-full w-full object-cover md:object-contain ${slide.focus} transition-opacity duration-[1400ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,14,0.48)_0%,rgba(8,10,14,0.14)_38%,rgba(8,10,14,0.04)_68%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.28)_0%,rgba(8,10,14,0.06)_40%,rgba(8,10,14,0.62)_100%)]" />
      <div className="container-page relative flex min-h-[100svh] flex-col justify-end pb-14 pt-28 sm:pb-20 [text-shadow:0_1px_16px_rgba(0,0,0,0.4)]">
        <p className="text-[0.72rem] font-semibold tracking-[0.22em] uppercase text-white/75">
          С октября по апрель
        </p>
        <h1 className="mt-4 max-w-3xl text-[clamp(1.55rem,6.4vw,3.35rem)] font-semibold leading-[1.12] tracking-tight text-pretty text-white">
          Утеплённые комбинезоны для зимы до −30 °C
        </h1>
        <p className="mt-4 max-w-xl text-base font-medium leading-snug text-white sm:text-lg">
          Премиум качество и гарантия тепла 100%
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
          Город, поездки, горы и прогулки с детьми — один комбинезон на разные
          сценарии зимы.
        </p>
        <p className="mt-5 text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
          от {formatPrice(fromPrice)}
        </p>
        <p className="mt-1 text-sm text-white/75">
          Доставка СДЭК и Ozon
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/catalog/kombinezony" className="btn btn-light w-full sm:w-auto">
            Смотреть комбинезоны
          </Link>
          <Link href="/size-guide" className="btn btn-ghost-light w-full sm:w-auto">
            Подобрать размер
          </Link>
        </div>
        <div className="mt-10 flex gap-1" role="tablist" aria-label="Слайды баннера">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              className="flex h-11 items-center px-1"
              onClick={() => setIndex(i)}
            >
              <span
                className={`block h-0.5 w-8 ${i === index ? "bg-white" : "bg-white/35"}`}
              />
              <span className="sr-only">Слайд {i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
