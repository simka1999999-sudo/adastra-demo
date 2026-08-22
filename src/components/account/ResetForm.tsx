"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { accountRequest } from "@/components/account/api";

export function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(token ? "" : "В ссылке нет кода сброса");

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
    try {
      await accountRequest("/api/account/reset", {
        method: "POST",
        body: JSON.stringify({ token, password }),
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
        <label className="label" htmlFor="password">
          Новый пароль
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
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn" disabled={pending || !token}>
        {pending ? "Сохраняем…" : "Сохранить пароль"}
      </button>
    </form>
  );
}
