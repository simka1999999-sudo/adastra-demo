"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPhoneDisplay, siteConfig } from "@/lib/site";
import { accountRequest } from "@/components/account/api";

export function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password !== confirm) {
      setError("Пароли не совпадают");
      setPending(false);
      return;
    }
    if (siteConfig.isStaticDemo) {
      setError(
        `Регистрация на демо отключена. Позвоните ${formatPhoneDisplay()} или напишите в Telegram.`,
      );
      setPending(false);
      return;
    }
    try {
      await accountRequest("/api/account/register", {
        method: "POST",
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          phone: String(form.get("phone") || ""),
          email: String(form.get("email") || ""),
          password,
          city: String(form.get("city") || ""),
          marketingOptIn: form.get("marketing") === "on",
        }),
      });
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="label" htmlFor="name">
          Имя
        </label>
        <input
          id="name"
          name="name"
          className="field"
          autoComplete="name"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Телефон
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          className="field"
          autoComplete="tel"
          required
        />
      </div>
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
        <label className="label" htmlFor="city">
          Город
        </label>
        <input
          id="city"
          name="city"
          className="field"
          autoComplete="address-level2"
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
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="confirm">
          Повторите пароль
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          className="field"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="marketing" className="mt-1" />
        Хочу получать новости о коллекциях и акциях
      </label>
      <p className="text-xs text-ink-muted">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <Link href="/offer" className="underline underline-offset-4">
          офертой
        </Link>{" "}
        и обработкой персональных данных.
      </p>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Создаём кабинет…" : "Зарегистрироваться"}
      </button>
      <p className="text-sm text-ink-muted">
        Уже есть кабинет?{" "}
        <Link href="/account/login" className="underline underline-offset-4">
          Войти
        </Link>
      </p>
    </form>
  );
}
