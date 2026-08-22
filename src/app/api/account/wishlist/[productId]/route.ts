import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCustomer } from "@/lib/customer-auth";

type Ctx = { params: Promise<{ productId: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const { productId } = await ctx.params;
  await prisma.wishlistItem.deleteMany({
    where: { customerId: customer.id, productId },
  });
  return NextResponse.json({ ok: true });
}
