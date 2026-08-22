"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { accountRequest } from "@/components/account/api";

export function PasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setSaved(false);
    const form = e.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password !== confirm) {
      setError("Пароли не совпадают");
      setPending(false);
      return;
    }
    try {
      await accountRequest("/api/account/password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: String(data.get("currentPassword") || ""),
          password,
        }),
      });
      form.reset();
      setSaved(true);
      setPending(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="label" htmlFor="currentPassword">
          Текущий пароль
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          className="field"
          autoComplete="current-password"
          required
        />
      </div>
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
      {saved ? <p className="text-sm text-success">Пароль обновлён</p> : null}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Сохраняем…" : "Сменить пароль"}
      </button>
    </form>
  );
}

export function DeleteAccountButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onClick() {
    const ok = window.confirm(
      "Удалить кабинет? Заказы в магазине сохранятся, войти больше не получится.",
    );
    if (!ok) return;
    setPending(true);
    setError("");
    try {
      await accountRequest("/api/account", { method: "DELETE" });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  return (
    <div className="max-w-lg">
      <button
        type="button"
        className="btn-ghost btn"
        disabled={pending}
        onClick={() => void onClick()}
      >
        {pending ? "Удаляем…" : "Удалить кабинет"}
      </button>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
