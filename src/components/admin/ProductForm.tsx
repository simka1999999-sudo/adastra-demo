"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { buildProductTitle } from "@/lib/catalog-identity";
import { isUploadedPhoto, productPhotoStatus } from "@/lib/products";
import { DEFAULT_SIZE_LABELS } from "@/lib/catalog-defaults";
import { withBasePath } from "@/lib/site";

type Props = { product?: Product };

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState(product?.images ?? []);
  const [shortTitle, setShortTitle] = useState(product?.shortTitle ?? "");
  const [color, setColor] = useState(product?.colors[0] ?? "");
  const [category, setCategory] = useState<Product["category"]>(
    product?.category ?? "overalls",
  );
  const previewTitle = buildProductTitle({ category, shortTitle, color });
  const photoKind = productPhotoStatus({ images });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const sizeLines = String(form.get("sizes") || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const payload = {
      masterSku: String(form.get("masterSku") || ""),
      shortTitle,
      color,
      category,
      gender: String(form.get("gender") || "women"),
      price: Number(form.get("price")),
      oldPrice: form.get("oldPrice") ? Number(form.get("oldPrice")) : null,
      collection: String(form.get("collection") || "Женская коллекция"),
      season: String(form.get("season") || "Зима"),
      country: String(form.get("country") || "Китай"),
      materials: String(form.get("materials") || ""),
      insulation: String(form.get("insulation") || ""),
      temperature: String(form.get("temperature") || ""),
      description: String(form.get("description") || ""),
      features: String(form.get("features") || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      sizes: sizeLines.map((label) => ({ label, inStock: true })),
      care: String(form.get("care") || ""),
      colorGroup: String(form.get("colorGroup") || "") || null,
      inStock: form.get("inStock") === "on",
      isHit: form.get("isHit") === "on",
      isNew: form.get("isNew") === "on",
      seoTitle: String(form.get("seoTitle") || ""),
      seoDescription: String(form.get("seoDescription") || ""),
    };

    try {
      const url = product
        ? withBasePath(`/api/admin/products/${product.id}`)
        : withBasePath("/api/admin/products");
      const res = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; product?: Product };
      if (!res.ok || !data.ok || !data.product) {
        throw new Error(data.error || "Не удалось сохранить");
      }
      const saved = data.product;
      const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
      if (files.length) {
        const fd = new FormData();
        files.forEach((f) => fd.append("files", f));
        const up = await fetch(withBasePath(`/api/admin/products/${saved.id}/images`), {
          method: "POST",
          body: fd,
        });
        const upData = (await up.json()) as { ok?: boolean; error?: string; product?: Product };
        if (!up.ok || !upData.ok) throw new Error(upData.error || "Фото не загрузились");
        if (upData.product) setImages(upData.product.images);
      }
      router.push(`/admin/products/${saved.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setPending(false);
    }
  }

  async function removePhoto(src: string) {
    if (!product) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch(withBasePath(`/api/admin/products/${product.id}/images`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; product?: Product };
      if (!res.ok || !data.ok || !data.product) throw new Error(data.error || "Не удалилось");
      setImages(data.product.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <p className="rounded-sm border border-line bg-ice/60 p-4 text-sm text-ink-muted">
          Цвет, название и фото — одна карточка. Не оставляйте lookbook, если
          цвет другой: загрузите снимки именно этой модели.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="masterSku">Артикул</label>
            <input
              id="masterSku"
              name="masterSku"
              className="field"
              required
              defaultValue={product?.masterSku ?? ""}
              readOnly={Boolean(product)}
            />
          </div>
          <div>
            <label className="label" htmlFor="shortTitle">Короткое имя</label>
            <input
              id="shortTitle"
              name="shortTitle"
              className="field"
              required
              value={shortTitle}
              onChange={(e) => setShortTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="color">Цвет</label>
            <input
              id="color"
              name="color"
              className="field"
              required
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="черный"
            />
          </div>
          <div>
            <label className="label" htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              className="field"
              value={category}
              onChange={(e) => setCategory(e.target.value as Product["category"])}
            >
              <option value="overalls">Комбинезоны</option>
              <option value="jackets">Куртки</option>
              <option value="coats">Пальто</option>
              <option value="pants">Брюки</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="price">Цена, ₽</label>
            <input id="price" name="price" className="field" type="number" min={1} required defaultValue={product?.price ?? 23990} />
          </div>
          <div>
            <label className="label" htmlFor="oldPrice">Старая цена</label>
            <input id="oldPrice" name="oldPrice" className="field" type="number" min={1} defaultValue={product?.oldPrice ?? ""} />
          </div>
        </div>
        <p className="text-sm">
          На витрине: <span className="font-semibold">{previewTitle || "—"}</span>
        </p>
        <div>
          <label className="label" htmlFor="description">Описание</label>
          <textarea id="description" name="description" className="field min-h-28" defaultValue={product?.description ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="features">Особенности (каждая с новой строки)</label>
          <textarea id="features" name="features" className="field min-h-28" defaultValue={(product?.features ?? []).join("\n")} />
        </div>
        <div>
          <label className="label" htmlFor="sizes">Размеры (один на строку)</label>
          <textarea
            id="sizes"
            name="sizes"
            className="field min-h-32 font-mono text-sm"
            required
            defaultValue={(product?.sizes ?? []).map((s) => s.label).join("\n") || DEFAULT_SIZE_LABELS.join("\n")}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="materials">Материалы</label>
            <textarea id="materials" name="materials" className="field min-h-24" defaultValue={product?.materials ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="care">Уход</label>
            <textarea id="care" name="care" className="field min-h-24" defaultValue={product?.care ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="insulation">Утеплитель</label>
            <input id="insulation" name="insulation" className="field" defaultValue={product?.insulation ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="temperature">Температура</label>
            <input id="temperature" name="temperature" className="field" defaultValue={product?.temperature ?? "от -5°С до -30°С"} />
          </div>
          <div>
            <label className="label" htmlFor="collection">Коллекция</label>
            <input id="collection" name="collection" className="field" required defaultValue={product?.collection ?? "Женская коллекция"} />
          </div>
          <div>
            <label className="label" htmlFor="colorGroup">Линейка цветов (id)</label>
            <input id="colorGroup" name="colorGroup" className="field" defaultValue={product?.colorGroup ?? ""} />
          </div>
        </div>
        <input type="hidden" name="season" defaultValue={product?.season ?? "Зима"} />
        <input type="hidden" name="country" defaultValue={product?.country ?? "Китай"} />
        <input type="hidden" name="gender" defaultValue={product?.gender ?? "women"} />
        <div>
          <label className="label" htmlFor="seoTitle">SEO title</label>
          <input id="seoTitle" name="seoTitle" className="field" defaultValue={product?.seo.title ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="seoDescription">SEO description</label>
          <textarea id="seoDescription" name="seoDescription" className="field min-h-20" defaultValue={product?.seo.description ?? ""} />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Сохраняем…" : product ? "Сохранить" : "Создать товар"}
        </button>
      </div>

      <aside className="space-y-5">
        <div className="border border-line bg-bg-elevated p-4">
          <p className="label mb-3">Фото этой карточки</p>
          <p className={`mb-3 text-sm ${photoKind === "ready" ? "text-success" : "text-danger"}`}>
            {photoKind === "ready"
              ? "Свои фото модели"
              : photoKind === "mixed"
                ? "Смешаны свои фото и lookbook — лучше оставить только снимки этой модели"
                : images.length
                  ? "Lookbook-заглушки — цвет на фото может не совпадать"
                  : "Нет фото — на витрине будет заглушка"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {images.map((src) => (
              <figure key={src} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
                <button
                  type="button"
                  className="mt-1 text-xs underline"
                  disabled={!product || pending}
                  onClick={() => void removePhoto(src)}
                >
                  {isUploadedPhoto(src) ? "Удалить" : "Убрать"}
                </button>
              </figure>
            ))}
          </div>
          <label className="label mt-4" htmlFor="files">
            Загрузить JPG / PNG / WebP
          </label>
          <input id="files" name="files" type="file" accept="image/jpeg,image/png,image/webp" multiple className="text-sm" />
          <p className="mt-2 text-xs text-ink-muted">
            Загрузка заменяет lookbook. До 12 фото, до 8 МБ каждое.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} />
          В наличии
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isHit" defaultChecked={product?.isHit} />
          Хит
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew} />
          Новинка
        </label>
      </aside>
    </form>
  );
}
