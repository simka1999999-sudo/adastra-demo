"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPhoneDisplay, siteConfig } from "@/lib/site";
import { accountRequest } from "@/components/account/api";

export function RecoverForm() {
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
      setError(`На демо восстановление выключено. ${formatPhoneDisplay()}`);
      setPending(false);
      return;
    }
    try {
      await accountRequest("/api/account/recover", {
        method: "POST",
        body: JSON.stringify({
          email: String(form.get("email") || ""),
          orderNumber: String(form.get("orderNumber") || ""),
          password,
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
        <label className="label" htmlFor="recover-email">
          Email из заказа
        </label>
        <input
          id="recover-email"
          name="email"
          type="email"
          className="field"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="orderNumber">
          Номер заказа
        </label>
        <input
          id="orderNumber"
          name="orderNumber"
          inputMode="numeric"
          className="field"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="recover-password">
          Новый пароль
        </label>
        <input
          id="recover-password"
          name="password"
          type="password"
          className="field"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="recover-confirm">
          Повторите пароль
        </label>
        <input
          id="recover-confirm"
          name="confirm"
          type="password"
          className="field"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Сохраняем…" : "Войти в кабинет"}
      </button>
    </form>
  );
}
