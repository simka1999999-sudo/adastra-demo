import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { customerAuthEnabled, hashToken } from "@/lib/customer-auth";
import { notifyCustomerEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

const schema = z.object({
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  if (!customerAuthEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Восстановление на этой витрине выключено" },
      { status: 403 },
    );
  }

  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (customer) {
      await prisma.passwordResetToken.deleteMany({
        where: { customerId: customer.id },
      });
      const token = randomBytes(32).toString("hex");
      await prisma.passwordResetToken.create({
        data: {
          customerId: customer.id,
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
      const resetUrl = `${siteConfig.url}/account/reset?token=${token}`;
      await notifyCustomerEmail({
        to: customer.email,
        subject: "Сброс пароля ADASTRA",
        text: `Чтобы задать новый пароль, откройте ссылку в течение часа:\n${resetUrl}\n\nЕсли вы не запрашивали сброс — просто проигнорируйте письмо.`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Укажите корректный email" },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить ссылку" },
      { status: 500 },
    );
  }
}
