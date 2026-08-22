"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPhoneDisplay, siteConfig } from "@/lib/site";
import { safeNextPath } from "@/lib/account-nav";
import { accountRequest } from "@/components/account/api";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    if (siteConfig.isStaticDemo) {
      setError(
        `Кабинет на демо выключен. Позвоните ${formatPhoneDisplay()} или напишите в Telegram.`,
      );
      setPending(false);
      return;
    }
    try {
      await accountRequest("/api/account/login", {
        method: "POST",
        body: JSON.stringify({
          email: String(form.get("email") || ""),
          password: String(form.get("password") || ""),
        }),
      });
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="field"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="field"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Входим…" : "Войти"}
      </button>
      <p className="text-sm text-ink-muted">
        Нет кабинета?{" "}
        <Link href="/account/register" className="underline underline-offset-4">
          Зарегистрироваться
        </Link>
        {" · "}
        <Link href="/account/forgot" className="underline underline-offset-4">
          Забыли пароль
        </Link>
        {" · "}
        <Link href="/account/find" className="underline underline-offset-4">
          Найти заказ
        </Link>
      </p>
    </form>
  );
}
