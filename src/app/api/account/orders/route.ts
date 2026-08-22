import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCustomer } from "@/lib/customer-auth";

export async function GET() {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, orders });
}
