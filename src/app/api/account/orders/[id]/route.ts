import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCustomer } from "@/lib/customer-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const { id } = await ctx.params;
  const order = await prisma.order.findFirst({
    where: { id, customerId: customer.id },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json(
      { ok: false, error: "Заказ не найден" },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true, order });
}
