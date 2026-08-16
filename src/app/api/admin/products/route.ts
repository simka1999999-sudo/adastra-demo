import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { readCatalog, upsertCatalogProduct } from "@/lib/catalog-store";
import { productWriteSchema, toCatalogProduct } from "@/lib/product-write";
import { revalidateCatalog } from "@/lib/revalidate-catalog";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  return NextResponse.json({ ok: true, products: readCatalog() });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    const json = await request.json();
    const data = productWriteSchema.parse(json);
    const existing = readCatalog();
    const next = toCatalogProduct(data);
    if (existing.some((p) => p.slug === next.slug || p.id === next.id)) {
      return NextResponse.json(
        { ok: false, error: "Такой артикул уже есть" },
        { status: 409 },
      );
    }
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
