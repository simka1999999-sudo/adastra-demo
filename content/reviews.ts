/**
 * Отзывы с Ozon (витрина). При появлении Seller API можно подтягивать автоматически.
 * Фото — макросы ткани и кроя, без чужих лиц.
 */
export type OzonReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  context?: string;
  image: string;
  imageFocus?: string;
};

export const ozonReviewsMeta = {
  totalLabel: "Более 1000 довольных клиентов",
  averageRating: 4.9,
  reviewsCountApprox: 2200,
};

export const ozonReviews: OzonReview[] = [
  {
    id: "r1",
    author: "Елена",
    rating: 5,
    text: "В −20 комфортно гулять с ребёнком. Размер сел по таблице.",
    context: "Город",
    image: "/lookbook/detail-omniheat.jpg",
  },
  {
    id: "r2",
    author: "Мария",
    rating: 5,
    text: "В поездке не мёрзнем, ткань плотная, выглядит стильно.",
    context: "Поездки",
    image: "/lookbook/detail-seams.jpg",
  },
  {
    id: "r3",
    author: "Анна",
    rating: 5,
    text: "В горах мембрана держит снег. Капюшон удобный.",
    context: "Горы",
    image: "/lookbook/hero-check.jpg",
    imageFocus: "object-[center_82%]",
  },
];
