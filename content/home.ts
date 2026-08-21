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
    image: "/lookbook/hero-check.jpg",
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
  imageFocus?: string;
};

export const featuresCompact: FeatureCompact[] = [
  {
    title: "Ткань",
    value: "мембрана 12 000 мм / 7000 г/м² — защита от ветра и снега",
    image: "/lookbook/hero-check.jpg",
    imageFocus: "object-[center_28%]",
  },
  {
    title: "Режим",
    value: "от −5 до −30 °C",
    image: "/lookbook/scene-mountains.jpg",
    imageFocus: "object-[center_40%]",
  },
  {
    title: "Утеплитель",
    value: "Thinsulate — максимум тепла без лишнего объёма",
    image: "/lookbook/hero-leo.jpg",
    imageFocus: "object-[center_22%]",
  },
  {
    title: "Размеры",
    value: "42–50 RU",
    image: "/lookbook/scene-kids.jpg",
    imageFocus: "object-[center_18%]",
  },
  {
    title: "Рост",
    value: "от 155 до 178 см",
    image: "/lookbook/hero-crane.jpg",
    imageFocus: "object-[center_12%]",
  },
];

export const featureDetails = [
  {
    title: "Подкладка Omni-Heat",
    value: "на 20% теплее обычной",
    image: "/lookbook/detail-omniheat.jpg",
  },
  {
    title: "Проклеенные швы",
    value: "не пропускают влагу",
    image: "/lookbook/detail-seams.jpg",
  },
];
