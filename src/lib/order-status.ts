export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "Принят",
  awaiting_payment: "Ожидает оплаты",
  paid: "Оплачен",
  confirmed: "Подтверждён",
  assembling: "Собирается",
  shipped: "В доставке",
  ready_pickup: "Готов к выдаче",
  delivered: "Получен",
  cancelled: "Отменён",
  payment_canceled: "Оплата не прошла",
};

export const DELIVERY_LABELS: Record<string, string> = {
  cdek: "СДЭК",
  ozon: "Ozon Доставка",
};

export const PAYMENT_LABELS: Record<string, string> = {
  cod: "При получении",
  online: "Онлайн",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] || status;
}

export function deliveryLabel(type: string): string {
  return DELIVERY_LABELS[type] || type;
}

export function paymentLabel(option: string): string {
  return PAYMENT_LABELS[option] || option;
}

export function canCancelOrder(status: string): boolean {
  return status === "new" || status === "awaiting_payment";
}

export function formatOrderDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
