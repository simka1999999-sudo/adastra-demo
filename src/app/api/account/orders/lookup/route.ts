import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer-auth";

const schema = z.object({
  number: z.coerce.number().int().positive(),
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();
    const order = await prisma.order.findFirst({
      where: { number: data.number, email },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Заказ не найден. Проверьте номер и почту." },
        { status: 404 },
      );
    }
    const customer = await getCurrentCustomer();
    if (customer && customer.email === email && !order.customerId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { customerId: customer.id },
      });
    }
    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        number: order.number,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        deliveryType: order.deliveryType,
        deliveryPrice: order.deliveryPrice,
        paymentOption: order.paymentOption,
        address: order.address,
        items: order.items,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Укажите номер заказа и почту" },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Не удалось найти заказ" },
      { status: 500 },
    );
  }
}
