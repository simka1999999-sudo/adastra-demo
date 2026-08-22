import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireCustomer } from "@/lib/customer-auth";
import { getProductById } from "@/lib/catalog-query";

const schema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
});

export async function GET() {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  const items = await prisma.wishlistItem.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, items });
}

export async function POST(request: Request) {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  try {
    const data = schema.parse(await request.json());
    const product = getProductById(data.productId);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Товар не найден" },
        { status: 404 },
      );
    }
    const item = await prisma.wishlistItem.upsert({
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId: data.productId,
        },
      },
      update: { slug: product.slug },
      create: {
        customerId: customer.id,
        productId: data.productId,
        slug: product.slug,
      },
    });
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Не удалось добавить в избранное" },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить избранное" },
      { status: 500 },
    );
  }
}
