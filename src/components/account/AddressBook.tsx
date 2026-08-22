"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { accountRequest } from "@/components/account/api";

export type AddressRow = {
  id: string;
  title: string;
  recipient: string;
  phone: string;
  city: string;
  line: string;
  isDefault: boolean;
};

export function AddressBook({
  initial,
  defaults,
}: {
  initial: AddressRow[];
  defaults: { recipient: string; phone: string; city: string };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await accountRequest("/api/account/addresses", {
        method: "POST",
        body: JSON.stringify({
          title: String(data.get("title") || "Адрес"),
          recipient: String(data.get("recipient") || ""),
          phone: String(data.get("phone") || ""),
          city: String(data.get("city") || ""),
          line: String(data.get("line") || ""),
          isDefault: data.get("isDefault") === "on",
        }),
      });
      form.reset();
      setPending(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  async function makeDefault(id: string) {
    setError("");
    try {
      await accountRequest(`/api/account/addresses/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isDefault: true }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      await accountRequest(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    }
  }

  return (
    <div className="space-y-10">
      {initial.length ? (
        <ul className="space-y-3">
          {initial.map((address) => (
            <li
              key={address.id}
              className="border border-line bg-bg-elevated p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] tracking-[0.14em] uppercase text-ink-muted">
                    {address.title}
                    {address.isDefault ? " · основной" : ""}
                  </p>
                  <p className="mt-2 font-medium">{address.recipient}</p>
                  <p className="mt-1 text-sm text-ink-muted">{address.phone}</p>
                  <p className="mt-1 text-sm">
                    {address.city}, {address.line}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {address.isDefault ? null : (
                    <button
                      type="button"
                      className="underline underline-offset-4"
                      onClick={() => void makeDefault(address.id)}
                    >
                      Сделать основным
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-ink-muted underline underline-offset-4"
                    onClick={() => void remove(address.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-muted">Пока нет сохранённых адресов.</p>
      )}

      <form onSubmit={add} className="max-w-lg space-y-5">
        <h2 className="text-xl">Новый адрес</h2>
        <div>
          <label className="label" htmlFor="title">
            Название
          </label>
          <input
            id="title"
            name="title"
            className="field"
            placeholder="Дом, ПВЗ, работа"
            defaultValue="Дом"
          />
        </div>
        <div>
          <label className="label" htmlFor="recipient">
            Получатель
          </label>
          <input
            id="recipient"
            name="recipient"
            className="field"
            defaultValue={defaults.recipient}
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
            defaultValue={defaults.phone}
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
            defaultValue={defaults.city}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="line">
            Улица или ПВЗ
          </label>
          <input id="line" name="line" className="field" required />
        </div>
        <label className="flex items-start gap-2 text-sm text-ink-muted">
          <input type="checkbox" name="isDefault" className="mt-1" />
          Основной адрес для следующих заказов
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Сохраняем…" : "Добавить адрес"}
        </button>
      </form>
    </div>
  );
}
