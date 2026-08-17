"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { withBasePath } from "@/lib/site";

type Row = {
  id: string;
  sku: string;
  title: string;
  status: "ok" | "skip" | "miss" | "error";
  photos: number;
  ozonId?: number;
  detail: string;
};

type Report = {
  ok: boolean;
  error?: string;
  ozonProducts?: number;
  pulled?: number;
  skipped?: number;
  missed?: number;
  failed?: number;
  rows?: Row[];
};

export function OzonPhotosForm({
  productId,
  configured,
}: {
  productId?: string;
  configured: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  async function run() {
    setPending(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch(withBasePath("/api/admin/products/ozon-photos"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: productId ? [productId] : undefined,
          onlyMissing: productId ? false : onlyMissing,
          force: false,
        }),
      });
      const data = (await res.json()) as Report;
      if (!res.ok || !data.ok) throw new Error(data.error || "Не удалось связаться с Ozon");
      setReport(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setPending(false);
    }
  }

  if (!configured) {
    return (
      <div className="border border-line bg-ice/40 p-5 text-sm text-ink-muted">
        <p className="font-medium text-ink">Фото с Ozon</p>
        <p className="mt-2">
          Чтобы забрать снимки из вашего кабинета продавца, добавьте в{" "}
          <code className="text-ink">.env</code> ключи{" "}
          <code className="text-ink">OZON_CLIENT_ID</code> и{" "}
          <code className="text-ink">OZON_API_KEY</code> из{" "}
          <a
            href="https://seller.ozon.ru/app/settings/api-keys"
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            seller.ozon.ru → API-ключи
          </a>
          , затем перезапустите сервер.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 border border-line bg-bg-elevated p-5">
      <p className="font-medium">Фото с Ozon</p>
      <p className="text-sm text-ink-muted">
        Сопоставляем товар по Ozon ID (из Excel или длинного номера в названии)
        или по артикулу = offer_id в кабинете. Скачиваем фото карточки Ozon на
        витрину.
      </p>
      {!productId ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyMissing}
            onChange={(e) => setOnlyMissing(e.target.checked)}
          />
          Только там, где ещё нет своих фото
        </label>
      ) : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="button" className="btn" disabled={pending} onClick={() => void run()}>
        {pending ? "Качаем с Ozon…" : productId ? "Подтянуть фото этой модели" : "Подтянуть фото с Ozon"}
      </button>
      {report?.rows ? (
        <p className="text-sm">
          На Ozon {report.ozonProducts} карточек · скачали {report.pulled} ·
          пропустили {report.skipped} · не нашли {report.missed} · ошибок{" "}
          {report.failed}
        </p>
      ) : null}
      {report?.rows?.length ? (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-line bg-ice/50 text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-ink-muted">
              <tr>
                <th className="px-3 py-3">Товар</th>
                <th className="px-3 py-3">Ozon</th>
                <th className="px-3 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row) => (
                <tr key={row.id} className="border-b border-line/70">
                  <td className="px-3 py-2">
                    {row.title}
                    <p className="text-xs text-ink-muted">{row.sku}</p>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{row.ozonId || "—"}</td>
                  <td className="px-3 py-2">
                    <span className={row.status === "ok" ? "text-success" : row.status === "skip" ? "text-ink-muted" : "text-danger"}>
                      {row.status === "ok"
                        ? `${row.photos} фото`
                        : row.detail}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
