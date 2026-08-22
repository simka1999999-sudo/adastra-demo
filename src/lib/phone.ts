export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+${digits}`;
  }
  if (digits.length === 10) return `+7${digits}`;
  return phone.trim();
}

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}
