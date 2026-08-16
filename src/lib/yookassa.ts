type CreatePaymentInput = {
  /** Amount in rubles (integer), as stored in orders */
  amount: number;
  description: string;
  orderId: string;
  returnUrl: string;
  customerEmail: string;
};

type YooPayment = {
  id: string;
  status: string;
  confirmation?: { confirmation_url?: string };
};

function authHeader(): string {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secret = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secret) {
    throw new Error("YooKassa credentials are not configured");
  }
  return "Basic " + Buffer.from(`${shopId}:${secret}`).toString("base64");
}

export function isYooKassaConfigured(): boolean {
  return Boolean(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}

export async function createYooKassaPayment(
  input: CreatePaymentInput,
): Promise<YooPayment> {
  const value = input.amount.toFixed(2);
  const res = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      "Idempotence-Key": input.orderId,
    },
    body: JSON.stringify({
      amount: {
        value,
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: input.returnUrl,
      },
      description: input.description,
      metadata: { orderId: input.orderId },
      receipt: {
        customer: { email: input.customerEmail },
        items: [
          {
            description: input.description.slice(0, 128),
            quantity: "1.00",
            amount: {
              value,
              currency: "RUB",
            },
            vat_code: 1,
            payment_mode: "full_payment",
            payment_subject: "commodity",
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YooKassa error: ${res.status} ${text}`);
  }

  return (await res.json()) as YooPayment;
}
