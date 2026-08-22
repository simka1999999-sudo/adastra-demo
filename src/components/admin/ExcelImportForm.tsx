"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { withBasePath } from "@/lib/site";
import { ExcelExportButtons } from "@/components/admin/ExcelExportButtons";
import { AdminNote } from "@/components/admin/FieldHint";

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
  const [dryRun, setDryRun] = useState(true);
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
      <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink-muted">
        <li>
          Скачайте текущий каталог — это все товары сайта в одной таблице.
          Лист «Как заполнять» объясняет каждую колонку.
        </li>
        <li>
          Правите строки в Excel. Шапку колонок не переименовывайте. Новая
          модель — новая строка с новым артикулом. Уже существующий артикул
          обновит карточку, а не создаст дубль.
        </li>
        <li>
          Сначала нажмите «Только проверить», посмотрите таблицу ниже. Если всё
          зелёное — снимите галочку и загрузите на сайт.
        </li>
        <li>
          Фото в Excel не едут. После загрузки — кнопка Ozon ниже или файлы в
          карточке товара.
        </li>
      </ol>

      <ExcelExportButtons />

      <form onSubmit={onSubmit} className="space-y-5 border border-line bg-bg-elevated p-5">
        <p className="font-medium">Загрузить товары из Excel на сайт</p>
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
          <p className="mt-1.5 text-xs text-ink-muted">
            Только формат Excel .xlsx, до 4 МБ. Старый .xls сайт не читает.
          </p>
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
          />
          <span>
            Только проверить, на сайт пока не писать
            <span className="mt-1 block text-xs text-ink-muted">
              Безопасный первый шаг: увидите, какие строки новые, какие обновят
              уже стоящие товары, где ошибка.
            </span>
          </span>
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" className="btn" disabled={pending}>
          {pending
            ? "Читаем…"
            : dryRun
              ? "Проверить файл"
              : "Загрузить на витрину"}
        </button>
      </form>

      {report ? (
        <div>
          <p className="mb-4 text-sm">
            {report.dryRun ? "Проверка, сайт не меняли: " : "Записано на сайт: "}
            {report.created} новых · {report.updated} обновлений · {report.failed}{" "}
            ошибок
          </p>
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-line bg-ice/50 text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-ink-muted">
                <tr>
                  <th className="px-3 py-3">Строка</th>
                  <th className="px-3 py-3">Артикул</th>
                  <th className="px-3 py-3">Название</th>
                  <th className="px-3 py-3">Что будет</th>
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
                          {row.action === "create"
                            ? "новая карточка"
                            : "обновить существующую"}
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

      <AdminNote title="Если что-то пошло не так">
        Сайт не удаляет товары из Excel: исчезнувшая из файла строка на витрине
        останется. Чтобы снять с продажи — откройте карточку и снимите «В
        наличии» или удалите товар вручную.
      </AdminNote>
    </div>
  );
}
