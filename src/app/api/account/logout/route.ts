import { NextResponse } from "next/server";
import {
  clearCustomerCookies,
  destroyCurrentSession,
} from "@/lib/customer-auth";

export async function POST() {
  await destroyCurrentSession();
  return clearCustomerCookies(NextResponse.json({ ok: true }));
}
