import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  attachOrdersByEmail,
  customerAuthEnabled,
  startCustomerSession,
} from "@/lib/customer-auth";
import { hashPassword } from "@/lib/password";
import { normalizePhone, phoneDigits } from "@/lib/phone";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().min(6).max(32),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  city: z.string().trim().max(80).optional().default(""),
  marketingOptIn: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  if (!customerAuthEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Регистрация на этой витрине выключена" },
      { status: 403 },
    );
  }

  try {
    const data = schema.parse(await request.json());
    if (phoneDigits(data.phone).length < 10) {
      return NextResponse.json(
        { ok: false, error: "Укажите телефон полностью" },
        { status: 400 },
      );
    }

    const email = data.email.toLowerCase();
    const passwordHash = await hashPassword(data.password);
    const existing = await prisma.customer.findUnique({ where: { email } });

    if (existing?.passwordHash) {
      return NextResponse.json(
        { ok: false, error: "Этот email уже зарегистрирован. Войдите в кабинет." },
        { status: 409 },
      );
    }

    const payload = {
      name: data.name,
      phone: normalizePhone(data.phone),
      city: data.city,
      marketingOptIn: data.marketingOptIn,
      passwordHash,
    };

    const customer = existing
      ? await prisma.customer.update({
          where: { id: existing.id },
          data: payload,
        })
      : await prisma.customer.create({
          data: { ...payload, email },
        });

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
      { ok: false, error: "Не удалось зарегистрироваться" },
      { status: 500 },
    );
  }
}
