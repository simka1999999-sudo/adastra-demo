import { ChipLink } from "@/components/ui/Chip";
import { categories } from "@/lib/categories";

export function CategoryNav({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`.trim()}>
      {categories.map((c) => (
        <li key={c.id}>
          <ChipLink href={`/catalog/${c.slug}`}>{c.label}</ChipLink>
        </li>
      ))}
    </ul>
  );
}
