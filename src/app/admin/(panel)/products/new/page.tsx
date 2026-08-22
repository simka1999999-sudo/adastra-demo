import { ProductForm } from "@/components/admin/ProductForm";
import { AdminNote } from "@/components/admin/FieldHint";

export default function NewProductPage() {
  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Новый товар</h2>
      <div className="mb-6">
        <AdminNote title="Когда пользоваться этой страницей">
          Одна новая модель или один новый цвет. Если нужно поменять цены у
          десятка позиций — откройте «Excel: скачать и загрузить».
        </AdminNote>
      </div>
      <ProductForm />
    </div>
  );
}
