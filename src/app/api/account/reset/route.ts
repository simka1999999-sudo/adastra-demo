import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  attachOrdersByEmail,
  customerAuthEnabled,
  destroyAllSessions,
  hashToken,
  startCustomerSession,
} from "@/lib/customer-auth";
import { hashPassword } from "@/lib/password";

const schema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  if (!customerAuthEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Сброс пароля на этой витрине выключен" },
      { status: 403 },
    );
  }

  try {
    const data = schema.parse(await request.json());
    const row = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(data.token) },
    });
    if (!row || row.expiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, error: "Ссылка устарела. Запросите сброс ещё раз." },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(data.password);
    const customer = await prisma.customer.update({
      where: { id: row.customerId },
      data: { passwordHash },
    });
    await prisma.passwordResetToken.deleteMany({
      where: { customerId: customer.id },
    });
    await destroyAllSessions(customer.id);
    await attachOrdersByEmail(customer.id, customer.email);
    return await startCustomerSession(customer.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Пароль не короче 8 символов" },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить пароль" },
      { status: 500 },
    );
  }
}
