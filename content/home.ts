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
    image: "/lookbook/scene-city.jpg",
  },
  {
    id: "trips",
    title: "Поездки",
    text: "В дороге и на остановках: защита от ветра, удобные карманы и свобода движения.",
    image: "/lookbook/scene-trips.jpg",
  },
  {
    id: "mountains",
    title: "Горы",
    text: "Мембрана 12 000 мм и снегозащита для активных зимних маршрутов.",
    image: "/lookbook/scene-mountains.jpg",
  },
  {
    id: "kids",
    title: "С детьми",
    text: "Долгие прогулки без переохлаждения — руки свободны, ребёнок в тепле рядом.",
    image: "/lookbook/scene-kids.jpg",
  },
];

export type FeatureCompact = {
  title: string;
  value: string;
  image?: string;
  imageFit?: "cover" | "contain";
  imageOnDark?: boolean;
};

export const featuresCompact: FeatureCompact[] = [
  {
    title: "Ткань",
    value: "непромокаемая мембрана 12 000 мм / 7000 г/м²",
    image: "/lookbook/detail-membrane.jpg",
    imageFit: "contain",
  },
  { title: "Режим", value: "от −5 до −30 °C" },
  {
    title: "Утеплитель",
    value: "Thinsulate — без лишнего объёма",
    image: "/lookbook/detail-thinsulate.jpg",
    imageFit: "contain",
    imageOnDark: true,
  },
  { title: "Размеры", value: "42–50 RU" },
  { title: "Рост", value: "от 155 до 180 см" },
  {
    title: "Подкладка",
    value: "Omniheat",
    image: "/lookbook/detail-omniheat.jpg",
  },
  {
    title: "Швы",
    value: "проклеены",
    image: "/lookbook/detail-seams.jpg",
  },
];
