"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { accountRequest } from "@/components/account/api";
import { brandSizes, heightGrades } from "../../../content/size";

type SizeValues = {
  heightCm: number | null;
  sizeRu: string;
  chestCm: number | null;
  waistCm: number | null;
  hipsCm: number | null;
};

function numOrNull(value: FormDataEntryValue | null): number | null {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function SizeForm({ initial }: { initial: SizeValues }) {
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
          heightCm: numOrNull(form.get("heightCm")),
          sizeRu: String(form.get("sizeRu") || ""),
          chestCm: numOrNull(form.get("chestCm")),
          waistCm: numOrNull(form.get("waistCm")),
          hipsCm: numOrNull(form.get("hipsCm")),
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
        <label className="label" htmlFor="heightCm">
          Рост, см
        </label>
        <input
          id="heightCm"
          name="heightCm"
          inputMode="numeric"
          className="field"
          defaultValue={initial.heightCm ?? ""}
          placeholder={heightGrades.map((g) => g.id).join(", ")}
        />
      </div>
      <div>
        <label className="label" htmlFor="sizeRu">
          Размер RU
        </label>
        <select
          id="sizeRu"
          name="sizeRu"
          className="field"
          defaultValue={initial.sizeRu}
        >
          <option value="">Не выбран</option>
          <option value="42">42</option>
          {brandSizes.map((s) => (
            <option key={s.ru} value={s.ru}>
              {s.ru} ({s.id})
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="chestCm">
            Грудь
          </label>
          <input
            id="chestCm"
            name="chestCm"
            inputMode="numeric"
            className="field"
            defaultValue={initial.chestCm ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="waistCm">
            Талия
          </label>
          <input
            id="waistCm"
            name="waistCm"
            inputMode="numeric"
            className="field"
            defaultValue={initial.waistCm ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="hipsCm">
            Бёдра
          </label>
          <input
            id="hipsCm"
            name="hipsCm"
            inputMode="numeric"
            className="field"
            defaultValue={initial.hipsCm ?? ""}
          />
        </div>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {saved ? <p className="text-sm text-success">Сохранено</p> : null}
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Сохраняем…" : "Сохранить мерки"}
      </button>
    </form>
  );
}
