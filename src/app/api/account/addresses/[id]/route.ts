import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireCustomer } from "@/lib/customer-auth";
import { normalizePhone, phoneDigits } from "@/lib/phone";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  title: z.string().trim().max(40).optional(),
  recipient: z.string().trim().min(2).max(80).optional(),
  phone: z.string().min(6).max(32).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  line: z.string().trim().min(5).max(200).optional(),
  isDefault: z.boolean().optional(),
});

async function ownAddress(customerId: string, id: string) {
  return prisma.address.findFirst({ where: { id, customerId } });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const { id } = await ctx.params;
  const existing = await ownAddress(customer.id, id);
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "Адрес не найден" },
      { status: 404 },
    );
  }

  try {
    const data = schema.parse(await request.json());
    if (data.phone && phoneDigits(data.phone).length < 10) {
      return NextResponse.json(
        { ok: false, error: "Укажите телефон полностью" },
        { status: 400 },
      );
    }
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { customerId: customer.id },
        data: { isDefault: false },
      });
    }
    const address = await prisma.address.update({
      where: { id },
      data: {
        title: data.title,
        recipient: data.recipient,
        phone: data.phone ? normalizePhone(data.phone) : undefined,
        city: data.city,
        line: data.line,
        isDefault: data.isDefault,
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
      { ok: false, error: "Не удалось обновить адрес" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const { id } = await ctx.params;
  const existing = await ownAddress(customer.id, id);
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "Адрес не найден" },
      { status: 404 },
    );
  }
  await prisma.address.delete({ where: { id } });
  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
    });
    if (next) {
      await prisma.address.update({
        where: { id: next.id },
        data: { isDefault: true },
      });
    }
  }
  return NextResponse.json({ ok: true });
}
