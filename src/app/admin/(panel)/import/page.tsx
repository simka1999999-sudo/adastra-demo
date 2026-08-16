import { ExcelImportForm } from "@/components/admin/ExcelImportForm";

export default function AdminImportPage() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 text-xl font-semibold">Excel: загрузка объёмом</h2>
      <p className="mb-8 text-sm text-ink-muted">
        Скачайте текущий каталог, поправьте строки в Excel и загрузите файл
        обратно. Пустые ячейки у новых товаров заполнятся заглушками. Фото в
        таблицу не входят — их по-прежнему грузят на карточке модели.
      </p>
      <ExcelImportForm />
    </div>
  );
}
