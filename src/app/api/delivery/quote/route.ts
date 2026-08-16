import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteDelivery } from "@/lib/delivery";

const schema = z.object({
  carrier: z.enum(["cdek", "ozon"]),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = schema.parse(json);
    const quote = await quoteDelivery(data);
    return NextResponse.json({ ok: true, quote });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось рассчитать доставку" },
      { status: 400 },
    );
  }
}
