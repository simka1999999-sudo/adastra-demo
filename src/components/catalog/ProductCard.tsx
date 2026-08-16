import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryLabels, formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const secondary = product.images[1];
  const badge = product.isHit ? "Хит" : product.isNew ? "Новинка" : null;

  return (
    <article className="group">
      <Link href={`/catalog/${product.slug}`} className="block">
        <div className="product-media relative aspect-[3/4] overflow-hidden bg-ice">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="img-primary object-cover"
          />
          {secondary ? (
            <Image
              src={secondary}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="img-secondary absolute inset-0 object-cover"
              aria-hidden
            />
          ) : null}
          {badge ? (
            <span className="absolute left-3 top-3 z-10 bg-ink px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] text-white uppercase">
              {badge}
            </span>
          ) : null}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-ink-muted">
              {categoryLabels[product.category]}
            </p>
            <h3 className="text-[0.95rem] leading-snug tracking-tight">
              {product.shortTitle}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold tabular-nums">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice ? (
              <p className="text-xs text-ink-muted line-through tabular-nums">
                {formatPrice(product.oldPrice)}
              </p>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
