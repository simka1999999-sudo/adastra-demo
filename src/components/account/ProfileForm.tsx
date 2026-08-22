"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { accountRequest } from "@/components/account/api";

type ProfileValues = {
  name: string;
  phone: string;
  email: string;
  city: string;
  marketingOptIn: boolean;
};

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setSaved(false);
    const form = new FormData(e.currentTarget);
    try {
      await accountRequest("/api/account/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          phone: String(form.get("phone") || ""),
          city: String(form.get("city") || ""),
          marketingOptIn: form.get("marketing") === "on",
        }),
      });
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
        <label className="label" htmlFor="name">
          Имя
        </label>
        <input
          id="name"
          name="name"
          className="field"
          defaultValue={initial.name}
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
          className="field"
          defaultValue={initial.phone}
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
          className="field"
          defaultValue={initial.email}
          disabled
        />
        <p className="mt-2 text-xs text-ink-muted">
          Почту меняем через поддержку — на неё приходят заказы.
        </p>
      </div>
      <div>
        <label className="label" htmlFor="city">
          Город
        </label>
        <input
          id="city"
          name="city"
          className="field"
          defaultValue={initial.city}
          autoComplete="address-level2"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          name="marketing"
          className="mt-1"
          defaultChecked={initial.marketingOptIn}
        />
        Новости о коллекциях и акциях
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {saved ? <p className="text-sm text-success">Сохранено</p> : null}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
