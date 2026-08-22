"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPhoneDisplay, siteConfig } from "@/lib/site";
import { accountRequest } from "@/components/account/api";

export function ForgotForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    if (siteConfig.isStaticDemo) {
      setError(`На демо восстановление выключено. ${formatPhoneDisplay()}`);
      setPending(false);
      return;
    }
    try {
      await accountRequest("/api/account/forgot", {
        method: "POST",
        body: JSON.stringify({ email: String(form.get("email") || "") }),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-lg border border-line bg-bg-elevated p-6">
        <h2 className="text-xl">Проверьте почту</h2>
        <p className="mt-3 text-sm text-ink-muted">
          Если этот email есть в магазине, мы отправили ссылку на сброс пароля.
          Письмо может идти несколько минут. Нет письма — восстановите доступ по
          номеру заказа.
        </p>
        <Link href="/account/login" className="btn mt-6 inline-flex">
          Ко входу
        </Link>
      </div>
    );
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
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Отправляем…" : "Прислать ссылку"}
      </button>
      <p className="text-sm text-ink-muted">
        <Link href="/account/login" className="underline underline-offset-4">
          Вернуться ко входу
        </Link>
      </p>
    </form>
  );
}
