"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPhoneDisplay, siteConfig, withBasePath } from "@/lib/site";

export function RegisterForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      city: String(form.get("city") || ""),
      marketingOptIn: form.get("marketing") === "on",
    };

    if (siteConfig.isStaticDemo) {
      setError(
        `Регистрация на демо отключена. Позвоните ${formatPhoneDisplay()} или напишите в Telegram.`,
      );
      setPending(false);
      return;
    }

    try {
      const res = await fetch(withBasePath("/api/account/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Не удалось зарегистрироваться");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="border border-line bg-bg-elevated p-6 md:p-8">
        <h2 className="text-xl">Спасибо!</h2>
        <p className="mt-3 text-sm text-ink-muted">
          Данные сохранены. Мы свяжемся при необходимости и учтём профиль при
          следующих заказах.
        </p>
        <Link href="/catalog" className="btn mt-6 inline-flex">
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="label" htmlFor="name">
          Имя
        </label>
        <input id="name" name="name" className="field" required />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Телефон
        </label>
        <input id="phone" name="phone" type="tel" className="field" required />
      </div>
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" className="field" required />
      </div>
      <div>
        <label className="label" htmlFor="city">
          Город
        </label>
        <input id="city" name="city" className="field" />
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
        {pending ? "Сохраняем…" : "Зарегистрироваться"}
      </button>
    </form>
  );
}
