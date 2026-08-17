import { ExcelImportForm } from "@/components/admin/ExcelImportForm";
import { OzonPhotosForm } from "@/components/admin/OzonPhotosForm";
import { ozonSellerConfigured } from "@/lib/ozon-seller";

export default function AdminImportPage() {
  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h2 className="mb-2 text-xl font-semibold">Excel: загрузка объёмом</h2>
        <p className="mb-8 text-sm text-ink-muted">
          Скачайте текущий каталог, поправьте строки в Excel и загрузите файл
          обратно. Если в названии или колонке «Ozon ID» есть номер карточки
          Ozon — после загрузки можно подтянуть фото из кабинета продавца.
        </p>
        <ExcelImportForm />
      </div>
      <OzonPhotosForm configured={ozonSellerConfigured()} />
    </div>
  );
}
