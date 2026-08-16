import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Lookbook — образы ADASTRA",
  description:
    "Lookbook бренда ADASTRA: образы с утеплёнными комбинезонами и верхней одеждой для зимы.",
  path: "/lookbook",
  image: "/lookbook/hero-1.jpg",
});

const shots = [
  "/lookbook/hero-1.jpg",
  "/lookbook/hero-2.jpg",
  "/lookbook/hero-3.jpg",
  "/lookbook/look-1.jpg",
  "/lookbook/look-2.jpg",
  "/lookbook/look-3.jpg",
  "/lookbook/look-4.jpg",
  "/lookbook/look-5.jpg",
];

export default function LookbookPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Lookbook" },
        ]}
      />
      <header className="mb-12 max-w-2xl">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
          Editorial
        </p>
        <h1 className="display mt-3 text-[clamp(2.4rem,5vw,3.6rem)] tracking-[-0.04em]">
          Lookbook
        </h1>
        <p className="mt-4 text-ink-muted">
          Зимние образы ADASTRA — комбинезоны и верхняя одежда в городе и на природе.
        </p>
      </header>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {shots.map((src) => (
          <div key={src} className="mb-4 break-inside-avoid overflow-hidden bg-line/30">
            <Image
              src={src}
              alt="Lookbook ADASTRA"
              width={900}
              height={1200}
              className="h-auto w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
