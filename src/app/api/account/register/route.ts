import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  city: z.string().optional().default(""),
  marketingOptIn: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = schema.parse(json);

    const existing = await prisma.customer.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) {
      await prisma.customer.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          phone: data.phone,
          city: data.city,
          marketingOptIn: data.marketingOptIn,
        },
      });
      return NextResponse.json({ ok: true, customerId: existing.id, updated: true });
    }

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email.toLowerCase(),
        city: data.city,
        marketingOptIn: data.marketingOptIn,
      },
    });

    return NextResponse.json({ ok: true, customerId: customer.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Проверьте поля формы" },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить данные" },
      { status: 500 },
    );
  }
}
