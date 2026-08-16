import Link from "next/link";
import { getCategoryPath } from "@/lib/categories";
import { getFilterOptions } from "@/lib/products";
import type { Product } from "@/lib/types";

type Props = {
  current: {
    category?: string;
    color?: string;
    size?: string;
    sort?: string;
    collection?: string;
    audience?: "women" | "all";
  };
  /** Чистый URL категории или /catalog — query только для фасетов. */
  basePath?: string;
};

function buildHref(
  basePath: string,
  current: Props["current"],
  patch: Partial<Props["current"]>,
) {
  const next = { ...current, ...patch };
  // Смена категории → ЧПУ категории (без ?category=)
  if (patch.category !== undefined) {
    if (!patch.category) return "/catalog";
    return getCategoryPath(patch.category as Product["category"]);
  }

  const params = new URLSearchParams();
  // на хабе /catalog можно оставить переход на ЧПУ; color/size/sort — query
  if (next.color) params.set("color", next.color);
  if (next.size) params.set("size", next.size);
  if (next.sort) params.set("sort", next.sort);
  if (next.collection) params.set("collection", next.collection);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function CatalogFilters({ current, basePath }: Props) {
  const { categories, colors, sizes, collections } = getFilterOptions({
    category: current.category,
    audience: current.audience,
  });
  const path =
    basePath ||
    (current.category
      ? getCategoryPath(current.category as Product["category"])
      : "/catalog");

  return (
    <aside className="space-y-8">
      <div>
        <p className="label">Категория</p>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/catalog"
              className={!current.category ? "text-ink" : "text-ink-muted"}
            >
              Все
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={getCategoryPath(c.id as Product["category"])}
                className={current.category === c.id ? "text-ink" : "text-ink-muted"}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="label">Цвет</p>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href={buildHref(path, current, { color: undefined })}
              className={!current.color ? "text-ink" : "text-ink-muted"}
            >
              Любой
            </Link>
          </li>
          {colors.map((color) => (
            <li key={color}>
              <Link
                href={buildHref(path, current, { color })}
                className={current.color === color ? "text-ink" : "text-ink-muted"}
              >
                {color}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {collections.length > 1 ? (
        <div>
          <p className="label">Коллекция</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href={buildHref(path, current, { collection: undefined })}
                className={!current.collection ? "text-ink" : "text-ink-muted"}
              >
                Все
              </Link>
            </li>
            {collections.map((collection) => (
              <li key={collection}>
                <Link
                  href={buildHref(path, current, { collection })}
                  className={
                    current.collection === collection ? "text-ink" : "text-ink-muted"
                  }
                >
                  {collection.replace(" коллекция", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="label">Рост</p>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href={buildHref(path, current, { size: undefined })}
              className={!current.size ? "text-ink" : "text-ink-muted"}
            >
              Любой
            </Link>
          </li>
          {sizes.map((s) => (
            <li key={s.id}>
              <Link
                href={buildHref(path, current, { size: s.id })}
                className={current.size === s.id ? "text-ink" : "text-ink-muted"}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="label">Сортировка</p>
        <ul className="space-y-2 text-sm">
          {[
            { id: undefined, label: "По умолчанию" },
            { id: "price_asc", label: "Цена ↑" },
            { id: "price_desc", label: "Цена ↓" },
          ].map((s) => (
            <li key={s.label}>
              <Link
                href={buildHref(path, current, { sort: s.id })}
                className={
                  current.sort === s.id || (!current.sort && !s.id)
                    ? "text-ink"
                    : "text-ink-muted"
                }
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
