import { BrandStar } from "@/components/BrandStar";

export function HeaderSearch({
  className = "",
  inputId = "site-search",
}: {
  className?: string;
  inputId?: string;
}) {
  return (
    <form
      action="/catalog"
      role="search"
      className={`flex min-h-10 min-w-0 items-center border border-current/25 ${className}`.trim()}
    >
      <label className="sr-only" htmlFor={inputId}>
        Поиск по каталогу
      </label>
      <input
        id={inputId}
        name="q"
        type="search"
        placeholder="Поиск"
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-current/45"
      />
      <button
        type="submit"
        className="inline-flex size-10 shrink-0 items-center justify-center"
        aria-label="Найти"
      >
        <BrandStar size={16} />
      </button>
    </form>
  );
}
