import { ExcelImportForm } from "@/components/admin/ExcelImportForm";
import { OzonPhotosForm } from "@/components/admin/OzonPhotosForm";
import { AdminNote } from "@/components/admin/FieldHint";
import { ozonSellerConfigured } from "@/lib/ozon-seller";

export default function AdminImportPage() {
  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h2 className="mb-2 text-xl font-semibold">Excel: скачать и загрузить</h2>
        <AdminNote title="Зачем это нужно">
          Чтобы править сразу много цен, размеров и описаний в таблице, а не
          открывать каждый товар. Один файл — весь каталог. После загрузки
          изменения сразу видны покупателям.
        </AdminNote>
        <div className="mt-8">
          <ExcelImportForm />
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">Фото с Ozon</h2>
        <p className="mb-4 text-sm text-ink-muted">
          Не вместо Excel, а после него: таблица привозит тексты и цены, эта
          кнопка — картинки из вашего кабинета продавца.
        </p>
        <OzonPhotosForm configured={ozonSellerConfigured()} />
      </div>
    </div>
  );
}
