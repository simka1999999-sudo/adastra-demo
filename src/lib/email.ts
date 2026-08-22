type OrderMail = {
  number: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
  deliveryType: string;
  paymentOption: string;
  total: number;
  items: { title: string; size: string; quantity: number; price: number }[];
};

export async function notifyManagerAboutOrder(order: OrderMail): Promise<void> {
  const to = process.env.MANAGER_EMAIL || process.env.NEXT_PUBLIC_EMAIL;
  if (!to) return;

  const lines = [
    `Новый заказ #${order.number}`,
    `Клиент: ${order.name}`,
    `Телефон: ${order.phone}`,
    `Email: ${order.email}`,
    `Адрес: ${order.address}`,
    `Доставка: ${order.deliveryType}`,
    `Оплата: ${order.paymentOption}`,
    `Комментарий: ${order.comment || "—"}`,
    "",
    "Товары:",
    ...order.items.map(
      (i) =>
        `- ${i.title} / ${i.size} × ${i.quantity} = ${i.price * i.quantity} ₽`,
    ),
    "",
    `Итого: ${order.total} ₽`,
  ];

  const host = process.env.SMTP_HOST;
  if (!host) {
    console.info("[order-email]", lines.join("\n"));
    return;
  }

  // Lightweight SMTP via fetch to a relay is not assumed; log until SMTP configured.
  // Keep hook for production wiring without hard dependency on nodemailer.
  console.info("[order-email:smtp-pending]", { to, subject: `Заказ #${order.number}` });
  console.info(lines.join("\n"));
}

export async function notifyCustomerEmail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.info("[customer-email]", input.subject, input.to);
    console.info(input.text);
    return;
  }
  console.info("[customer-email:smtp-pending]", {
    to: input.to,
    subject: input.subject,
  });
  console.info(input.text);
}
