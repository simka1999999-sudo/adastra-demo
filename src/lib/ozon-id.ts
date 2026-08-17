export function parseOzonId(raw: string): number | undefined {
  const match = String(raw).match(/(\d{6,})/);
  if (!match) return undefined;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : undefined;
}
