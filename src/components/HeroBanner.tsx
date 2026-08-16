"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/lookbook/hero-1.jpg",
    alt: "Женский утеплённый комбинезон ADASTRA",
  },
  {
    src: "/lookbook/hero-2.jpg",
    alt: "ADASTRA в городе и на прогулке",
  },
  {
    src: "/lookbook/hero-3.jpg",
    alt: "Комбинезон ADASTRA для зимы",
  },
];

export function HeroBanner() {
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
          className={`hero-media object-cover object-[center_20%] transition-opacity duration-[1400ms] ease-out ${
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
        <h1 className="mt-4 max-w-2xl text-[clamp(1.7rem,4.4vw,3.15rem)] font-semibold leading-[1.12] tracking-tight text-white">
          Утеплённые комбинезоны для зимы — тепло и стиль до −30 °C
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
          Город, поездки, горы и прогулки с детьми — один комбинезон на разные
          сценарии зимы.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/catalog/kombinezony" className="btn btn-light">
            Смотреть комбинезоны
          </Link>
          <Link href="/size-guide" className="btn btn-ghost-light">
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
