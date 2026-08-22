import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  publicCustomer,
  requireCustomer,
} from "@/lib/customer-auth";
import { normalizePhone, phoneDigits } from "@/lib/phone";

const optionalInt = (min: number, max: number) =>
  z.number().int().min(min).max(max).nullable().optional();

const schema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().min(6).max(32).optional(),
  city: z.string().trim().max(80).optional(),
  marketingOptIn: z.boolean().optional(),
  heightCm: optionalInt(140, 200),
  sizeRu: z.string().max(8).optional(),
  chestCm: optionalInt(60, 160),
  waistCm: optionalInt(50, 160),
  hipsCm: optionalInt(60, 180),
});

export async function GET() {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  return NextResponse.json({ ok: true, customer: publicCustomer(customer) });
}

export async function PATCH(request: Request) {
  const { customer, error } = await requireCustomer();
  if (error) return error;

  try {
    const data = schema.parse(await request.json());
    if (data.phone && phoneDigits(data.phone).length < 10) {
      return NextResponse.json(
        { ok: false, error: "Укажите телефон полностью" },
        { status: 400 },
      );
    }
    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.phone !== undefined
          ? { phone: normalizePhone(data.phone) }
          : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.marketingOptIn !== undefined
          ? { marketingOptIn: data.marketingOptIn }
          : {}),
        ...(data.heightCm !== undefined ? { heightCm: data.heightCm } : {}),
        ...(data.sizeRu !== undefined ? { sizeRu: data.sizeRu } : {}),
        ...(data.chestCm !== undefined ? { chestCm: data.chestCm } : {}),
        ...(data.waistCm !== undefined ? { waistCm: data.waistCm } : {}),
        ...(data.hipsCm !== undefined ? { hipsCm: data.hipsCm } : {}),
      },
    });
    return NextResponse.json({ ok: true, customer: publicCustomer(updated) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Проверьте поля профиля" },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить профиль" },
      { status: 500 },
    );
  }
}
