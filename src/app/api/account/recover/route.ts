import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  attachOrdersByEmail,
  customerAuthEnabled,
  destroyAllSessions,
  startCustomerSession,
} from "@/lib/customer-auth";
import { hashPassword } from "@/lib/password";

const schema = z.object({
  email: z.string().trim().email(),
  orderNumber: z.coerce.number().int().positive(),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  if (!customerAuthEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Восстановление на этой витрине выключено" },
      { status: 403 },
    );
  }

  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();
    const order = await prisma.order.findFirst({
      where: { number: data.orderNumber, email },
    });
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Заказ с такой почтой не найден" },
        { status: 404 },
      );
    }

    const passwordHash = await hashPassword(data.password);
    const existing = await prisma.customer.findUnique({ where: { email } });
    const customer = existing
      ? await prisma.customer.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            name: existing.name || order.name,
            phone: existing.phone || order.phone,
          },
        })
      : await prisma.customer.create({
          data: {
            email,
            name: order.name,
            phone: order.phone,
            passwordHash,
          },
        });

    await prisma.order.update({
      where: { id: order.id },
      data: { customerId: customer.id },
    });
    await attachOrdersByEmail(customer.id, email);
    await destroyAllSessions(customer.id);
    return await startCustomerSession(customer.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Проверьте номер заказа, почту и пароль" },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Не удалось восстановить доступ" },
      { status: 500 },
    );
  }
}
