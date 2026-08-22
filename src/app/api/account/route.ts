import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  clearCustomerCookies,
  destroyAllSessions,
  requireCustomer,
} from "@/lib/customer-auth";

export async function DELETE() {
  const { customer, error } = await requireCustomer();
  if (error) return error;

  await prisma.$transaction([
    prisma.order.updateMany({
      where: { customerId: customer.id },
      data: { customerId: null },
    }),
    prisma.customer.delete({ where: { id: customer.id } }),
  ]);
  await destroyAllSessions(customer.id);
  return clearCustomerCookies(NextResponse.json({ ok: true }));
}
