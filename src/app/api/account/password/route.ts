import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  destroyAllSessions,
  requireCustomer,
  startCustomerSession,
} from "@/lib/customer-auth";
import { hashPassword, verifyPassword } from "@/lib/password";

const schema = z.object({
  currentPassword: z.string().min(1).max(72),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  const { customer, error } = await requireCustomer();
  if (error) return error;

  try {
    const data = schema.parse(await request.json());
    if (!customer.passwordHash) {
      return NextResponse.json(
        { ok: false, error: "Сначала задайте пароль через восстановление доступа" },
        { status: 400 },
      );
    }
    const matches = await verifyPassword(
      data.currentPassword,
      customer.passwordHash,
    );
    if (!matches) {
      return NextResponse.json(
        { ok: false, error: "Текущий пароль неверный" },
        { status: 401 },
      );
    }
    const passwordHash = await hashPassword(data.password);
    await prisma.customer.update({
      where: { id: customer.id },
      data: { passwordHash },
    });
    await destroyAllSessions(customer.id);
    return await startCustomerSession(customer.id);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Новый пароль не короче 8 символов" },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Не удалось сменить пароль" },
      { status: 500 },
    );
  }
}
