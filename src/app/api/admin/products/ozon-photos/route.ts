import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { ozonSellerConfigured } from "@/lib/ozon-seller";
import { pullOzonPhotos } from "@/lib/ozon-photos";
import { revalidateCatalogAll } from "@/lib/revalidate-catalog";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  return NextResponse.json({ ok: true, configured: ozonSellerConfigured() });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  const body = (await request.json().catch(() => ({}))) as {
    ids?: string[];
    onlyMissing?: boolean;
    force?: boolean;
  };
  try {
    const report = await pullOzonPhotos({
      ids: Array.isArray(body.ids) ? body.ids.map(String) : undefined,
      onlyMissing: body.onlyMissing !== false,
      force: Boolean(body.force),
    });
    revalidateCatalogAll();
    return NextResponse.json({ ok: true, ...report });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Ozon недоступен" },
      { status: 400 },
    );
  }
}
