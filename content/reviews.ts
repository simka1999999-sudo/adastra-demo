/**
 * Отзывы с Ozon (витрина). При появлении Seller API можно подтягивать автоматически.
 * Пока — курируемый блок + ссылка на магазин.
 */
export type OzonReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  context?: string;
};

export const ozonReviewsMeta = {
  totalLabel: "тысячи отзывов на Ozon",
  averageRating: 4.9,
  reviewsCountApprox: 2200,
};

export const ozonReviews: OzonReview[] = [
  {
    id: "r1",
    author: "Елена",
    rating: 5,
    text: "Комбинезон очень тёплый, в −20 комфортно гулять с ребёнком. Размер подошёл по таблице.",
    context: "Город · прогулки",
  },
  {
    id: "r2",
    author: "Мария",
    rating: 5,
    text: "Брали в поездку — в машине и на остановках не мёрзнем, ткань плотная, выглядит стильно.",
    context: "Поездки",
  },
  {
    id: "r3",
    author: "Анна",
    rating: 5,
    text: "Носили в горах: мембрана держит снег, капюшон удобный. Качество на уровне.",
    context: "Горы",
  },
  {
    id: "r4",
    author: "Ирина",
    rating: 4,
    text: "Посадка женская, не мешковато. Доставка Ozon быстрая, всё пришло аккуратно.",
    context: "Ozon",
  },
];
