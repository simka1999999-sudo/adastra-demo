import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import {
  adminConfigured,
  applyAdminCookie,
  passwordMatches,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (siteConfig.isStaticDemo || !adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Админка на этой витрине выключена" },
      { status: 403 },
    );
  }
  const body = (await request.json()) as { password?: string };
  if (!passwordMatches(String(body.password || ""))) {
    return NextResponse.json({ ok: false, error: "Неверный пароль" }, { status: 401 });
  }
  return await applyAdminCookie(NextResponse.json({ ok: true }));
}
