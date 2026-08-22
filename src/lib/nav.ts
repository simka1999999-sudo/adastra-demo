export type NavItem = {
  href: string;
  label: string;
};

/** Служебные страницы в меню — категории вынесены в чипы (закон Хика). */
export const buyerNav: NavItem[] = [
  { href: "/lookbook", label: "Lookbook" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/size-guide", label: "Как выбрать размер" },
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/returns", label: "Возврат" },
  { href: "/contacts", label: "Контакты" },
];

export const companyNav: NavItem[] = [
  { href: "/about", label: "О бренде" },
  { href: "/partners", label: "Партнёрам" },
  { href: "/offer", label: "Публичная оферта" },
  { href: "/account", label: "Личный кабинет" },
];

/** Плоский список — для активных состояний и старых ссылок. */
export const mainNav: NavItem[] = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog/kombinezony", label: "Комбинезоны" },
  ...buyerNav,
  ...companyNav,
];
