import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Хлебные крошки" className="mb-6 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${item.name}-${i}`} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden>/</span> : null}
                {last || !item.path ? (
                  <span className={last ? "text-ink" : undefined}>{item.name}</span>
                ) : (
                  <Link href={item.path} className="hover:text-ink">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
