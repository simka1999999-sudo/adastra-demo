import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type WebhookBody = {
  event?: string;
  object?: {
    id?: string;
    status?: string;
    metadata?: { orderId?: string };
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WebhookBody;
    const paymentId = body.object?.id;
    const status = body.object?.status;
    const orderId = body.object?.metadata?.orderId;

    if (!paymentId || !status) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const order = orderId
      ? await prisma.order.findUnique({ where: { id: orderId } })
      : await prisma.order.findFirst({ where: { yookassaId: paymentId } });

    if (!order) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    let nextStatus = order.status;
    if (status === "succeeded") nextStatus = "paid";
    if (status === "canceled") nextStatus = "payment_canceled";

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        yookassaId: paymentId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
