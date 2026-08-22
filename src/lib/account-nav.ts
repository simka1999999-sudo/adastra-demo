export const ACCOUNT_PUBLIC_PATHS = [
  "/account/login",
  "/account/register",
  "/account/forgot",
  "/account/reset",
  "/account/find",
] as const;

export const accountNav: { href: string; label: string }[] = [
  { href: "/account", label: "Обзор" },
  { href: "/account/orders", label: "Заказы" },
  { href: "/account/favorites", label: "Избранное" },
  { href: "/account/addresses", label: "Адреса" },
  { href: "/account/size", label: "Размер" },
  { href: "/account/profile", label: "Профиль" },
  { href: "/account/security", label: "Безопасность" },
];

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/account";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return "/account";
  }
  return raw;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "гость";
}
