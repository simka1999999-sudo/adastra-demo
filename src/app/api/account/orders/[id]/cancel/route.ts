import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCustomer } from "@/lib/customer-auth";
import { canCancelOrder } from "@/lib/order-status";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const { id } = await ctx.params;
  const order = await prisma.order.findFirst({
    where: { id, customerId: customer.id },
  });
  if (!order) {
    return NextResponse.json(
      { ok: false, error: "Заказ не найден" },
      { status: 404 },
    );
  }
  if (!canCancelOrder(order.status)) {
    return NextResponse.json(
      { ok: false, error: "Этот заказ уже нельзя отменить из кабинета" },
      { status: 409 },
    );
  }
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: "cancelled" },
    include: { items: true },
  });
  return NextResponse.json({ ok: true, order: updated });
}
