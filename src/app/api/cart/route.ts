import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CART_COOKIE,
  parseCartCookie,
  serializeCartCookie,
} from "@/lib/cart";
import type { CartItem } from "@/lib/types";

export async function GET() {
  const jar = await cookies();
  const items = parseCartCookie(jar.get(CART_COOKIE)?.value);
  return NextResponse.json({ items });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { items?: CartItem[] };
  const items = Array.isArray(body.items) ? body.items : [];
  const jar = await cookies();
  jar.set(CART_COOKIE, serializeCartCookie(items), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return NextResponse.json({ items });
}
