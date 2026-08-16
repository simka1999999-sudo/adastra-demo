import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { cartTotal } from "@/lib/cart";
import { notifyManagerAboutOrder } from "@/lib/email";
import { createYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { siteConfig } from "@/lib/site";
import type { CartItem } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().optional().default(""),
  comment: z.string().optional().default(""),
  deliveryType: z.enum(["cdek", "ozon"]),
  deliveryPrice: z.number().int().min(0),
  paymentOption: z.enum(["cod", "online"]),
  createAccount: z.boolean().optional().default(false),
  items: z
    .array(
      z.object({
        productId: z.string(),
        slug: z.string(),
        title: z.string(),
        sizeId: z.string(),
        sizeLabel: z.string(),
        price: z.number().int().positive(),
        quantity: z.number().int().positive(),
        image: z.string(),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = schema.parse(json);
    const items = data.items as CartItem[];
    const goodsTotal = cartTotal(items);
    const total = goodsTotal + data.deliveryPrice;

    let customerId: string | undefined;
    if (data.createAccount) {
      const email = data.email.toLowerCase();
      const existing = await prisma.customer.findUnique({ where: { email } });
      if (existing) {
        await prisma.customer.update({
          where: { id: existing.id },
          data: {
            name: data.name,
            phone: data.phone,
            city: data.city,
          },
        });
        customerId = existing.id;
      } else {
        const customer = await prisma.customer.create({
          data: {
            name: data.name,
            phone: data.phone,
            email,
            city: data.city,
          },
        });
        customerId = customer.id;
      }
    }

    const last = await prisma.order.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });
    const number = (last?.number ?? 1000) + 1;

    const order = await prisma.order.create({
      data: {
        number,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        comment: data.comment,
        deliveryType: data.deliveryType,
        deliveryPrice: data.deliveryPrice,
        paymentOption: data.paymentOption,
        status: data.paymentOption === "online" ? "awaiting_payment" : "new",
        total,
        customerId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            title: item.title,
            size: item.sizeLabel,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    await notifyManagerAboutOrder({
      number: order.number,
      name: order.name,
      phone: order.phone,
      email: order.email,
      address: order.address,
      comment: order.comment,
      deliveryType: `${order.deliveryType} (${order.deliveryPrice} ₽)`,
      paymentOption: order.paymentOption,
      total: order.total,
      items: order.items.map((i) => ({
        title: i.title,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
      })),
    });

    if (data.paymentOption === "online") {
      if (!isYooKassaConfigured()) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Онлайн-оплата временно недоступна: не заданы ключи ЮKassa. Выберите оплату при получении или добавьте YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY.",
          },
          { status: 503 },
        );
      }

      const returnUrl =
        process.env.YOOKASSA_RETURN_URL ||
        `${siteConfig.url}/order/success?id=${order.id}`;

      const payment = await createYooKassaPayment({
        amount: order.total,
        description: `Заказ ADASTRA #${order.number}`,
        orderId: order.id,
        returnUrl,
        customerEmail: order.email,
      });

      const paymentUrl = payment.confirmation?.confirmation_url;
      await prisma.order.update({
        where: { id: order.id },
        data: {
          yookassaId: payment.id,
          paymentUrl: paymentUrl ?? null,
        },
      });

      return NextResponse.json({
        ok: true,
        orderId: order.id,
        paymentUrl,
      });
    }

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Проверьте поля формы" },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Ошибка сервера",
      },
      { status: 500 },
    );
  }
}
