import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireCustomer } from "@/lib/customer-auth";
import { normalizePhone, phoneDigits } from "@/lib/phone";

const schema = z.object({
  title: z.string().trim().max(40).optional().default("Адрес"),
  recipient: z.string().trim().min(2).max(80),
  phone: z.string().min(6).max(32),
  city: z.string().trim().min(2).max(80),
  line: z.string().trim().min(5).max(200),
  isDefault: z.boolean().optional().default(false),
});

export async function GET() {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const addresses = await prisma.address.findMany({
    where: { customerId: customer.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, addresses });
}

export async function POST(request: Request) {
  const { customer, error } = await requireCustomer();
  if (error) return error;

  try {
    const data = schema.parse(await request.json());
    if (phoneDigits(data.phone).length < 10) {
      return NextResponse.json(
        { ok: false, error: "Укажите телефон полностью" },
        { status: 400 },
      );
    }
    const count = await prisma.address.count({
      where: { customerId: customer.id },
    });
    if (count >= 8) {
      return NextResponse.json(
        { ok: false, error: "Можно сохранить не больше 8 адресов" },
        { status: 400 },
      );
    }
    const makeDefault = data.isDefault || count === 0;
    if (makeDefault) {
      await prisma.address.updateMany({
        where: { customerId: customer.id },
        data: { isDefault: false },
      });
    }
    const address = await prisma.address.create({
      data: {
        customerId: customer.id,
        title: data.title || "Адрес",
        recipient: data.recipient,
        phone: normalizePhone(data.phone),
        city: data.city,
        line: data.line,
        isDefault: makeDefault,
      },
    });
    return NextResponse.json({ ok: true, address });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Проверьте поля адреса" },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить адрес" },
      { status: 500 },
    );
  }
}
