import { NextResponse } from "next/server";
import {
  customerAuthEnabled,
  getCurrentCustomer,
  publicCustomer,
} from "@/lib/customer-auth";

export async function GET() {
  if (!customerAuthEnabled()) {
    return NextResponse.json({ ok: true, customer: null });
  }
  const customer = await getCurrentCustomer();
  return NextResponse.json({
    ok: true,
    customer: customer ? publicCustomer(customer) : null,
  });
}
