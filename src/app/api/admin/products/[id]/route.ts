import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import {
  readCatalog,
  removeCatalogProduct,
  removeUploadedFile,
  upsertCatalogProduct,
} from "@/lib/catalog-store";
import { productWriteSchema, toCatalogProduct } from "@/lib/product-write";
import { revalidateCatalog } from "@/lib/revalidate-catalog";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { id } = await ctx.params;
  const current = readCatalog().find((p) => p.id === id);
  if (!current) {
    return NextResponse.json({ ok: false, error: "Товар не найден" }, { status: 404 });
  }
  try {
    const json = await request.json();
    const data = productWriteSchema.parse({ ...json, id });
    const next = toCatalogProduct(data, current);
    upsertCatalogProduct(next);
    revalidateCatalog(next.slug, next.id);
    return NextResponse.json({ ok: true, product: next });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Ошибка" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { id } = await ctx.params;
  const current = readCatalog().find((p) => p.id === id);
  if (!current) {
    return NextResponse.json({ ok: false, error: "Товар не найден" }, { status: 404 });
  }
  current.images.forEach(removeUploadedFile);
  removeCatalogProduct(id);
  revalidateCatalog(current.slug, id);
  return NextResponse.json({ ok: true });
}
