"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { withBasePath } from "@/lib/site";

type Row = {
  row: number;
  action: "create" | "update";
  sku: string;
  title: string;
  error?: string;
};

type Report = {
  ok: boolean;
  dryRun: boolean;
  created: number;
  updated: number;
  failed: number;
  rows: Row[];
  error?: string;
};

export function ExcelImportForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setReport(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch(
        withBasePath(`/api/admin/products/import${dryRun ? "?dryRun=1" : ""}`),
        { method: "POST", body: fd },
      );
      const data = (await res.json()) as Report;
      if (!res.ok || !data.ok) throw new Error(data.error || "Не удалось прочитать файл");
      setReport(data);
      if (!dryRun && data.failed < data.rows.length) router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <a href={withBasePath("/api/admin/products/export?template=1")} className="chip">
          Скачать шаблон
        </a>
        <a href={withBasePath("/api/admin/products/export")} className="chip">
          Скачать текущий каталог
        </a>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 border border-line bg-bg-elevated p-5">
        <div>
          <label className="label" htmlFor="file">
            Файл .xlsx
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            required
            className="text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
          />
          Только проверить, не записывать на витрину
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Читаем…" : dryRun ? "Проверить файл" : "Загрузить товары"}
        </button>
      </form>

      {report ? (
        <div>
          <p className="mb-4 text-sm">
            {report.dryRun ? "Проверка: " : "Готово: "}
            {report.created} новых · {report.updated} обновлений · {report.failed} ошибок
            {report.dryRun ? " (на витрину не писали)" : ""}
          </p>
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-line bg-ice/50 text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-ink-muted">
                <tr>
                  <th className="px-3 py-3">Строка</th>
                  <th className="px-3 py-3">Артикул</th>
                  <th className="px-3 py-3">Название</th>
                  <th className="px-3 py-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row) => (
                  <tr key={`${row.row}-${row.sku}`} className="border-b border-line/70">
                    <td className="px-3 py-2 tabular-nums">{row.row}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.sku || "—"}</td>
                    <td className="px-3 py-2">{row.title || "—"}</td>
                    <td className="px-3 py-2">
                      {row.error ? (
                        <span className="text-danger">{row.error}</span>
                      ) : (
                        <span className="text-success">
                          {row.action === "create" ? "новый" : "обновить"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
