export type NavItem = {
  href: string;
  label: string;
};

/** Главное меню — выезжает слева (как у референса, но панель слева по ТЗ). */
export const mainNav: NavItem[] = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog/kombinezony", label: "Комбинезоны" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/size-guide", label: "Как выбрать размер" },
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/returns", label: "Возврат" },
  { href: "/contacts", label: "Контакты" },
  { href: "/about", label: "О бренде" },
  { href: "/partners", label: "Партнёрам" },
  { href: "/offer", label: "Публичная оферта" },
  { href: "/account/register", label: "Регистрация" },
];
