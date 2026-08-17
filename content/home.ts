export type UseCase = {
  id: string;
  title: string;
  text: string;
  image: string;
};

export const useCases: UseCase[] = [
  {
    id: "city",
    title: "Город",
    text: "На работу, в метро и на выходные — тёплый силуэт без лишнего объёма.",
    image: "/lookbook/look-2.jpg",
  },
  {
    id: "trips",
    title: "Поездки",
    text: "В дороге и на остановках: защита от ветра, удобные карманы и свобода движения.",
    image: "/lookbook/hero-2.jpg",
  },
  {
    id: "mountains",
    title: "Горы",
    text: "Мембрана 12 000 мм и снегозащита для активных зимних маршрутов.",
    image: "/lookbook/hero-1.jpg",
  },
  {
    id: "kids",
    title: "С детьми",
    text: "Долгие прогулки без переохлаждения — руки свободны, ребёнок в тепле рядом.",
    image: "/lookbook/look-4.jpg",
  },
];

export type FeatureCompact = {
  title: string;
  value: string;
};

export const featuresCompact: FeatureCompact[] = [
  { title: "Режим", value: "от −5 до −30 °C" },
  { title: "Рост", value: "от 155 до 180 см" },
  { title: "Размеры", value: "42–50 RU" },
  { title: "Утеплитель", value: "Thinsulate" },
  { title: "Мембрана", value: "12 000 мм / 7000 г/м²" },
  { title: "Пропитка", value: "грязеотталкивающая" },
  { title: "Защита", value: "непромокаемые 100%" },
];
