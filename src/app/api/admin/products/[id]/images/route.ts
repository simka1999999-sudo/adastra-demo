import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import {
  isOwnProductPhoto,
  productUploadDir,
  readCatalog,
  removeUploadedFile,
  sanitizeSegment,
  upsertCatalogProduct,
} from "@/lib/catalog-store";
import { revalidateCatalog } from "@/lib/revalidate-catalog";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_PHOTOS = 12;

function ext(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { id } = await ctx.params;
  const current = readCatalog().find((p) => p.id === id);
  if (!current) {
    return NextResponse.json({ ok: false, error: "Сначала сохраните карточку" }, { status: 404 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) {
    return NextResponse.json({ ok: false, error: "Выберите файлы" }, { status: 400 });
  }

  const own = current.images.filter(isOwnProductPhoto);
  if (own.length + files.length > MAX_PHOTOS) {
    return NextResponse.json(
      { ok: false, error: `Не больше ${MAX_PHOTOS} фото на товар` },
      { status: 400 },
    );
  }

  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Только JPG, PNG или WebP" },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Файл больше 8 МБ" }, { status: 400 });
    }
  }

  const dir = productUploadDir(id);
  mkdirSync(dir, { recursive: true });
  const added: string[] = [];
  const stamp = Date.now();

  for (const [i, file] of files.entries()) {
    const name = `${stamp}-${i}.${ext(file.type)}`;
    const abs = join(dir, name);
    const buf = Buffer.from(await file.arrayBuffer());
    writeFileSync(abs, buf);
    added.push(`/uploads/products/${sanitizeSegment(id)}/${name}`);
  }

  const next = { ...current, images: [...own, ...added] };
  upsertCatalogProduct(next);
  revalidateCatalog(next.slug, next.id);
  return NextResponse.json({ ok: true, product: next });
}

export async function DELETE(request: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { id } = await ctx.params;
  const current = readCatalog().find((p) => p.id === id);
  if (!current) {
    return NextResponse.json({ ok: false, error: "Товар не найден" }, { status: 404 });
  }
  const body = (await request.json()) as { src?: string };
  const src = String(body.src || "");
  if (!src || !current.images.includes(src)) {
    return NextResponse.json({ ok: false, error: "Фото не найдено" }, { status: 404 });
  }
  removeUploadedFile(src);
  const next = { ...current, images: current.images.filter((s) => s !== src) };
  upsertCatalogProduct(next);
  revalidateCatalog(next.slug, next.id);
  return NextResponse.json({ ok: true, product: next });
}
