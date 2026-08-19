"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";

const slides = [
  {
    src: "/lookbook/hero-check.jpg",
    alt: "Комбинезон ADASTRA Black Hit — чёрный с клеткой",
  },
  {
    src: "/lookbook/hero-leo.jpg",
    alt: "Комбинезон ADASTRA Leo Hit — чёрный с леопардом",
  },
  {
    src: "/lookbook/hero-crane.jpg",
    alt: "Комбинезон ADASTRA Stork — чёрный с журавлями",
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
    <section className="relative -mt-[var(--header-h)] min-h-[100svh] overflow-hidden bg-ink text-white">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          fill
          priority={i === 0}
          className={`hero-media object-cover object-[center_top] transition-opacity duration-[1400ms] ease-out ${
            i === index ? "opacity-80 kenburns-active" : "opacity-0"
          }`}
          sizes="100vw"
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.55)_0%,rgba(8,10,14,0.12)_38%,rgba(8,10,14,0.82)_100%)]" />
      <div className="noise" />
      <div className="container-page relative flex min-h-[100svh] flex-col justify-end pb-14 pt-28 sm:pb-20">
        <p className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-white/70">
          ADASTRA
        </p>
        <h1 className="mt-4 max-w-2xl text-[clamp(1.45rem,6.2vw,3.15rem)] font-semibold leading-[1.15] tracking-tight text-pretty text-white">
          Утеплённые комбинезоны для зимы — тепло и стиль до −30 °C
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
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
