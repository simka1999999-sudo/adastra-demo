import Link from "next/link";
import { readCatalog } from "@/lib/catalog-store";
import { formatPrice, productPhotoStatus } from "@/lib/products";

const PHOTO_LABEL = {
  ready: { text: "свои", className: "text-success" },
  mixed: { text: "смесь", className: "text-danger" },
  lookbook: { text: "заглушка", className: "text-danger" },
  none: { text: "нет фото", className: "text-danger" },
} as const;

export default function AdminProductsPage() {
  const list = readCatalog();
  const needPhotos = list.filter((p) => productPhotoStatus(p) !== "ready").length;

  return (
    <div>
      <p className="mb-6 text-sm text-ink-muted">
        {list.length} товаров · {needPhotos} без своих фото. Объём — через{" "}
        <Link href="/admin/import" className="underline underline-offset-4">
          Excel и Ozon
        </Link>
        .
      </p>
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-ice/50 text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-ink-muted">
            <tr>
              <th className="px-3 py-3">Товар</th>
              <th className="px-3 py-3">Цвет</th>
              <th className="px-3 py-3">Цена</th>
              <th className="px-3 py-3">Фото</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const photo = PHOTO_LABEL[productPhotoStatus(p)];
              return (
                <tr key={p.id} className="border-b border-line/70">
                  <td className="px-3 py-3">
                    <Link href={`/admin/products/${p.id}`} className="font-medium underline-offset-4 hover:underline">
                      {p.shortTitle}
                    </Link>
                    <p className="text-xs text-ink-muted">{p.masterSku}</p>
                  </td>
                  <td className="px-3 py-3">{p.colors[0] || "—"}</td>
                  <td className="px-3 py-3 tabular-nums">{formatPrice(p.price)}</td>
                  <td className="px-3 py-3">
                    <span className={photo.className}>{photo.text}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
