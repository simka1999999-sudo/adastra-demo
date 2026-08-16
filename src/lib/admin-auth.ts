import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminConfigured,
  cookieMatches,
  sessionToken,
} from "@/lib/admin-session";

export {
  ADMIN_COOKIE,
  adminConfigured,
  cookieMatches,
  passwordMatches,
  sessionToken,
} from "@/lib/admin-session";

export async function isAdminRequest() {
  if (!adminConfigured()) return false;
  const jar = await cookies();
  return await cookieMatches(jar.get(ADMIN_COOKIE)?.value);
}

export function unauthorized() {
  return NextResponse.json({ ok: false, error: "Нет доступа" }, { status: 401 });
}

export async function applyAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: await sessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
