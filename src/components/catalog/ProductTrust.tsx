import Link from "next/link";

const items = [
  { href: "/delivery", label: "СДЭК и Ozon", hint: "Доставка по России" },
  { href: "/delivery", label: "Онлайн или при получении", hint: "Оплата" },
  { href: "/returns", label: "14 дней", hint: "Возврат и обмен" },
  { href: "/cart", label: "Без регистрации", hint: "Оформление" },
];

export function ProductTrust() {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 border-t border-line pt-6 text-sm sm:grid-cols-4">
      {items.map((item) => (
        <li key={item.label}>
          <Link href={item.href} className="block hover:text-ink">
            <p className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase text-ink-muted">
              {item.hint}
            </p>
            <p className="mt-1 leading-snug">{item.label}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
