"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { accountNav } from "@/lib/account-nav";
import { withBasePath } from "@/lib/site";

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch(withBasePath("/api/account/logout"), { method: "POST" });
    router.push("/account/login");
    router.refresh();
  }

  return (
    <nav className="mt-6 flex flex-col gap-0.5" aria-label="Разделы кабинета">
      {accountNav.map((item) => {
        const active =
          item.href === "/account"
            ? pathname === "/account"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`min-h-11 border-b border-line/70 py-3 text-sm font-medium ${
              active ? "text-ink" : "text-ink-muted hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => void logout()}
        className="mt-3 min-h-11 text-left text-sm text-ink-muted underline underline-offset-4"
      >
        Выйти
      </button>
    </nav>
  );
}
