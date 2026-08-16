import { ChipLink } from "@/components/ui/Chip";
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

const COLOR_SWATCH: Record<string, string> = {
  бежевый: "#d4c4a8",
  бирюзовый: "#3f9e9a",
  бордовый: "#6b1d2a",
  зеленый: "#4f6b3a",
  красный: "#b4232c",
  разноцветный:
    "conic-gradient(from 90deg,#c45c5c,#d4c4a8,#3f9e9a,#2c4a7c,#5b3d8f,#c45c5c)",
  розовый: "#e8a0b4",
  серый: "#8a8f96",
  синий: "#2c4a7c",
  фиолетовый: "#5b3d8f",
  хаки: "#6b6340",
  черный: "#0b0d10",
};

function buildHref(
  basePath: string,
  current: Props["current"],
  patch: Partial<Props["current"]>,
) {
  const next = { ...current, ...patch };
  if (patch.category !== undefined) {
    if (!patch.category) return "/catalog";
    return getCategoryPath(patch.category as Product["category"]);
  }

  const params = new URLSearchParams();
  if (next.color) params.set("color", next.color);
  if (next.size) params.set("size", next.size);
  if (next.sort) params.set("sort", next.sort);
  if (next.collection) params.set("collection", next.collection);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function ColorDot({ name }: { name: string }) {
  const fill = COLOR_SWATCH[name.toLowerCase()] || "#9aa3ad";
  return (
    <span
      aria-hidden
      className="size-3.5 shrink-0 rounded-full border border-black/20"
      style={{ background: fill }}
    />
  );
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function FilterGroups({ current, path }: { current: Props["current"]; path: string }) {
  const { categories, colors, sizes, collections } = getFilterOptions({
    category: current.category,
    audience: current.audience,
  });
  const hasFacet = Boolean(
    current.color || current.size || current.sort || current.collection,
  );

  return (
    <div className="space-y-5">
      {hasFacet ? (
        <ChipLink href={path}>Сбросить</ChipLink>
      ) : null}

      <div>
        <p className="label">Категория</p>
        <div className="flex flex-wrap gap-1.5">
          <ChipLink href="/catalog" active={!current.category}>
            Все
          </ChipLink>
          {categories.map((c) => (
            <ChipLink
              key={c.id}
              href={getCategoryPath(c.id as Product["category"])}
              active={current.category === c.id}
            >
              {c.label}
            </ChipLink>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Цвет</p>
        <div className="flex flex-wrap gap-1.5">
          <ChipLink
            href={buildHref(path, current, { color: undefined })}
            active={!current.color}
          >
            Любой
          </ChipLink>
          {colors.map((color) => (
            <ChipLink
              key={color}
              href={buildHref(path, current, { color })}
              active={current.color === color}
            >
              <ColorDot name={color} />
              {titleCase(color)}
            </ChipLink>
          ))}
        </div>
      </div>

      {collections.length > 1 ? (
        <div>
          <p className="label">Коллекция</p>
          <div className="flex flex-wrap gap-1.5">
            <ChipLink
              href={buildHref(path, current, { collection: undefined })}
              active={!current.collection}
            >
              Все
            </ChipLink>
            {collections.map((collection) => (
              <ChipLink
                key={collection}
                href={buildHref(path, current, { collection })}
                active={current.collection === collection}
              >
                {collection.replace(" коллекция", "")}
              </ChipLink>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="label">Рост</p>
        <div className="flex flex-wrap gap-1.5">
          <ChipLink
            href={buildHref(path, current, { size: undefined })}
            active={!current.size}
          >
            Любой
          </ChipLink>
          {sizes.map((s) => (
            <ChipLink
              key={s.id}
              href={buildHref(path, current, { size: s.id })}
              active={current.size === s.id}
            >
              {s.label}
            </ChipLink>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Сортировка</p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: undefined, label: "Популярные" },
            { id: "price_asc", label: "Дешевле" },
            { id: "price_desc", label: "Дороже" },
          ].map((s) => (
            <ChipLink
              key={s.label}
              href={buildHref(path, current, { sort: s.id })}
              active={current.sort === s.id || (!current.sort && !s.id)}
            >
              {s.label}
            </ChipLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CatalogFilters({ current, basePath }: Props) {
  const path =
    basePath ||
    (current.category
      ? getCategoryPath(current.category as Product["category"])
      : "/catalog");
  const bodyProps = { current, path };

  return (
    <>
      <details className="rounded-sm border border-line bg-bg-elevated/70 p-4 md:hidden">
        <summary className="flex min-h-10 cursor-pointer list-none items-center text-sm font-semibold">
          Фильтры
        </summary>
        <div className="mt-4">
          <FilterGroups {...bodyProps} />
        </div>
      </details>
      <aside className="hidden md:sticky md:top-[calc(var(--header-h)+1rem)] md:block md:self-start">
        <FilterGroups {...bodyProps} />
      </aside>
    </>
  );
}
