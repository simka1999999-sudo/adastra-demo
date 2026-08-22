import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { cartTotal } from "@/lib/cart";
import { notifyManagerAboutOrder } from "@/lib/email";
import { createYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { siteConfig } from "@/lib/site";
import type { CartItem } from "@/lib/types";
import {
  applyCustomerCookies,
  attachOrdersByEmail,
  createSession,
  getCurrentCustomer,
} from "@/lib/customer-auth";
import { hashPassword } from "@/lib/password";
import { normalizePhone } from "@/lib/phone";

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
  password: z.string().min(8).max(72).optional(),
  saveAddress: z.boolean().optional().default(false),
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

    const email = data.email.toLowerCase();
    const phone = normalizePhone(data.phone);
    const sessionCustomer = await getCurrentCustomer();
    let customerId = sessionCustomer?.id;

    if (sessionCustomer) {
      await prisma.customer.update({
        where: { id: sessionCustomer.id },
        data: {
          name: data.name,
          phone,
          city: data.city,
        },
      });
    } else if (data.createAccount) {
      if (!data.password) {
        return NextResponse.json(
          { ok: false, error: "Для кабинета задайте пароль не короче 8 символов" },
          { status: 400 },
        );
      }
      const existing = await prisma.customer.findUnique({ where: { email } });
      if (existing?.passwordHash) {
        return NextResponse.json(
          { ok: false, error: "Этот email уже зарегистрирован. Войдите в кабинет." },
          { status: 409 },
        );
      }
      const passwordHash = await hashPassword(data.password);
      const customer = existing
        ? await prisma.customer.update({
            where: { id: existing.id },
            data: {
              name: data.name,
              phone,
              city: data.city,
              passwordHash,
            },
          })
        : await prisma.customer.create({
            data: {
              name: data.name,
              phone,
              email,
              city: data.city,
              passwordHash,
            },
          });
      customerId = customer.id;
      await attachOrdersByEmail(customer.id, email);
    }

    const newSession =
      !sessionCustomer && customerId && data.createAccount && data.password
        ? await createSession(customerId)
        : null;

    const finish = (body: Record<string, unknown>) => {
      const res = NextResponse.json(body);
      if (!newSession) return res;
      return applyCustomerCookies(res, newSession.token, newSession.expiresAt);
    };

    if (customerId && data.saveAddress) {
      const same = await prisma.address.findFirst({
        where: {
          customerId,
          city: data.city,
          line: data.address,
        },
      });
      await prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
      if (same) {
        await prisma.address.update({
          where: { id: same.id },
          data: { isDefault: true, recipient: data.name, phone },
        });
      } else {
        await prisma.address.create({
          data: {
            customerId,
            title: "Последний заказ",
            recipient: data.name,
            phone,
            city: data.city,
            line: data.address,
            isDefault: true,
          },
        });
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
        phone,
        email,
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

      return finish({
        ok: true,
        orderId: order.id,
        orderNumber: order.number,
        paymentUrl,
      });
    }

    return finish({ ok: true, orderId: order.id, orderNumber: order.number });
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
