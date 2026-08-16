"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductPhotoStub } from "@/components/catalog/ProductPhotoStub";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const cover = images[active] ?? images[0];

  if (!images.length) {
    return (
      <div className="overflow-hidden border border-line">
        <div className="aspect-[3/4]">
          <ProductPhotoStub caption="Фото этой модели появится позже" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-2 md:order-1 md:flex-col">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className={`relative aspect-[3/4] w-20 overflow-hidden border ${
              i === active ? "border-ink" : "border-transparent"
            }`}
            onClick={() => setActive(i)}
            aria-label={`Фото ${i + 1}`}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-[3/4] overflow-hidden bg-line/30 md:order-2">
        <Image
          src={cover}
          alt={alt}
          fill
          priority
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
