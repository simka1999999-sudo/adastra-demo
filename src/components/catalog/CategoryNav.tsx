import Link from "next/link";
import { categories } from "@/lib/categories";

export function CategoryNav({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`.trim()}>
      {categories.map((c) => (
        <li key={c.id}>
          <Link
            href={`/catalog/${c.slug}`}
            className="inline-flex items-center border border-line px-3 py-1.5 text-[0.8rem] leading-none text-ink transition-colors hover:border-ink"
          >
            {c.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
