import Link from "next/link";

const items = [
  { href: "/delivery", label: "СДЭК и Ozon", hint: "Доставка по России" },
  { href: "/delivery", label: "Онлайн или при получении", hint: "Оплата" },
  { href: "/returns", label: "14 дней", hint: "Возврат и обмен" },
  { href: "/cart", label: "Без регистрации", hint: "Оформление" },
];

export function ProductTrust() {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-2 border-t border-line pt-6 sm:grid-cols-4 sm:gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <Link href={item.href} className="choice h-full min-h-0 flex-col gap-1">
            <p className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase text-ink-muted">
              {item.hint}
            </p>
            <p className="text-sm leading-snug">{item.label}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
