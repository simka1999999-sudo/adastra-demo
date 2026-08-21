/**
 * Хиты Ольги: «заказано в большом количестве».
 * В таблице это master SKU с hit в артикуле.
 * Имиджевые кадры HDxYn ставим на эти карточки в первую очередь.
 */
export const HIT_SKUS = [
  "blackhit18",
  "leohit86",
  "stork18",
  "belt blackhit18",
  "belt leohit86",
  "12blackhit",
  "7blackhit",
] as const;

/** Три модели на главной: клетка, леопард, журавли. Без дублей с поясом. */
export const HOME_HIT_SKUS = ["blackhit18", "leohit86", "stork18"] as const;

export type HitSku = (typeof HIT_SKUS)[number];

export function isHitSku(sku: string): boolean {
  return (HIT_SKUS as readonly string[]).includes(sku);
}
