import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  attachOrdersByEmail,
  customerAuthEnabled,
  startCustomerSession,
} from "@/lib/customer-auth";
import { verifyPassword } from "@/lib/password";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(72),
});

export async function POST(request: Request) {
  if (!customerAuthEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Вход на этой витрине выключен" },
      { status: 403 },
    );
  }

  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer?.passwordHash) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Неверный email или пароль. Если кабинет ещё не создавали — зарегистрируйтесь или восстановите доступ.",
        },
        { status: 401 },
      );
    }
    const ok = await verifyPassword(data.password, customer.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Неверный email или пароль" },
        { status: 401 },
      );
    }
    await attachOrdersByEmail(customer.id, email);
    return await startCustomerSession(customer.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Проверьте поля формы" },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Не удалось войти" },
      { status: 500 },
    );
  }
}
