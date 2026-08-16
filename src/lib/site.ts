export const legalEntity = {
  fullName:
    "ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ЖУМАХАНОВА ОЛЬГА АЛЕКСЕЕВНА",
  shortName: "ИП Жумаханова О.А.",
  inn: "504711184211",
  ogrnip: "321508100160910",
  legalAddress:
    "105082, Россия, г. Москва, ул. Большая Почтовая, д. 32, 28",
  actualAddress:
    "105082, Россия, г. Москва, ул. Большая Почтовая, д. 32, 28",
  bank: {
    name: 'ООО "Банк Точка"',
    checkingAccount: "40802810501500159846",
    correspondentAccount: "30101810745374525104",
    bik: "044525104",
    inn: "9721194461",
    kpp: "997950001",
    legalAddress:
      "109456, РОССИЯ, г.МОСКВА, 1-Й ВЕШНЯКОВСКИЙ пр, ДОМ 1 СТР8, 1 этаж, пом.№43",
    okpo: "2007004992",
    oktmo: "46783000001",
  },
};

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "ADASTRA",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  /** Префикс GitHub Pages, например `/adastra-demo`. Для Link не нужен — только для fetch. */
  basePath: (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, ""),
  /** Статическая витрина без API (GitHub Pages). */
  isStaticDemo: process.env.NEXT_PUBLIC_STATIC_DEMO === "true",
  description:
    "ADASTRA — утеплённые женские комбинезоны и верхняя одежда с доставкой по России. Мембрана 12000 мм, до −30 °C.",
  phone: process.env.NEXT_PUBLIC_PHONE || "+7 (985) 439-42-91",
  phoneRaw: (process.env.NEXT_PUBLIC_PHONE || "+79854394291").replace(
    /[^\d+]/g,
    "",
  ),
  email: process.env.NEXT_PUBLIC_EMAIL || "order@adastrashop.com",
  metrikaId: process.env.NEXT_PUBLIC_METRIKA_ID || "",
  ozonShopUrl:
    process.env.NEXT_PUBLIC_OZON_SHOP_URL ||
    "https://www.ozon.ru/seller/adastra/products/?miniapp=seller_231971",
  social: {
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://www.instagram.com/adastra_fashion/",
    telegram:
      process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/adastra_fashion",
    max: process.env.NEXT_PUBLIC_MAX_URL || "https://max.ru/",
    youtube:
      process.env.NEXT_PUBLIC_YOUTUBE_URL ||
      "https://www.youtube.com/@olgakozlova1777",
  },
  legal: legalEntity,
  hours: "ежедневно 10:00–20:00 МСК",
  /** Прод: NEXT_PUBLIC_ALLOW_INDEXING=true. Демо по умолчанию закрыто от индексации. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
};

export function withBasePath(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return siteConfig.basePath ? `${siteConfig.basePath}${p}` : p;
}

export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${p}`;
}

export const socialNav: { id: string; label: string; href: string }[] = [
  { id: "instagram", label: "Instagram", href: siteConfig.social.instagram },
  { id: "telegram", label: "Telegram", href: siteConfig.social.telegram },
  { id: "max", label: "Max", href: siteConfig.social.max },
  { id: "youtube", label: "YouTube", href: siteConfig.social.youtube },
];

export function formatPhoneDisplay(phone = siteConfig.phone): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  }
  return phone;
}
