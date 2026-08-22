import { withBasePath } from "@/lib/site";

export function ExcelExportButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <a href={withBasePath("/api/admin/products/export")} className="btn">
        Скачать все товары в Excel
      </a>
      <a
        href={withBasePath("/api/admin/products/export?template=1")}
        className="btn-ghost btn"
      >
        Скачать пустой шаблон
      </a>
    </div>
  );
}
