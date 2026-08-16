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
          alt={slide.alt}
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
        <div className="relative h-14 w-[min(18rem,72vw)] sm:h-20 sm:w-[28rem]">
          <Image
            src="/brand/logo-wordmark-light.png"
            alt="ADASTRA"
            fill
            className="object-contain object-left"
            sizes="(max-width: 640px) 72vw, 28rem"
            priority
          />
        </div>
        <h1 className="mt-6 max-w-xl text-lg font-medium leading-snug text-white/92 sm:text-2xl">
          Утеплённые комбинезоны для зимы — тепло и стиль до −30 °C
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:text-[0.95rem]">
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
        <div className="mt-10 flex gap-2" aria-hidden>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`h-0.5 w-8 transition-colors ${i === index ? "bg-white" : "bg-white/35"}`}
              onClick={() => setIndex(i)}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
