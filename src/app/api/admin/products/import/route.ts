import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { readCatalog, upsertCatalogProducts } from "@/lib/catalog-store";
import { parseCatalogExcel } from "@/lib/catalog-excel";
import { revalidateCatalogAll } from "@/lib/revalidate-catalog";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ ok: false, error: "Выберите файл .xlsx" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Файл больше 4 МБ" }, { status: 400 });
  }
  const name = file.name.toLowerCase();
  if (!name.endsWith(".xlsx")) {
    return NextResponse.json(
      { ok: false, error: "Нужен файл Excel в формате .xlsx" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const rows = await parseCatalogExcel(buffer, readCatalog());
    if (!rows.length) {
      return NextResponse.json(
        { ok: false, error: "В таблице нет строк с товарами" },
        { status: 400 },
      );
    }
    const ready = rows.filter((r) => r.product && !r.error);
    if (!dryRun && ready.length) {
      upsertCatalogProducts(ready.map((r) => r.product!));
      revalidateCatalogAll();
    }
    return NextResponse.json({
      ok: true,
      dryRun,
      created: ready.filter((r) => r.action === "create").length,
      updated: ready.filter((r) => r.action === "update").length,
      failed: rows.filter((r) => r.error).length,
      rows: rows.map(({ product: _product, ...rest }) => rest),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Не удалось прочитать Excel" },
      { status: 400 },
    );
  }
}
