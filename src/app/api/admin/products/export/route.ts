import { NextResponse } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { readCatalog } from "@/lib/catalog-store";
import { catalogTemplateBuffer, catalogToExcelBuffer } from "@/lib/catalog-excel";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  const template = new URL(request.url).searchParams.get("template") === "1";
  const buffer = template
    ? await catalogTemplateBuffer()
    : await catalogToExcelBuffer(readCatalog());
  const filename = template ? "adastra-shablon.xlsx" : "adastra-catalog.xlsx";
  const bytes = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  return new NextResponse(bytes, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
