import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

export async function POST() {
  return clearAdminCookie(NextResponse.json({ ok: true }));
}
