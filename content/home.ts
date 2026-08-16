export type UseCase = {
  id: string;
  title: string;
  text: string;
};

export const useCases: UseCase[] = [
  {
    id: "city",
    title: "Город",
    text: "На работу, в метро и на выходные — тёплый силуэт без лишнего объёма.",
  },
  {
    id: "trips",
    title: "Поездки",
    text: "В дороге и на остановках: защита от ветра, удобные карманы и свобода движения.",
  },
  {
    id: "mountains",
    title: "Горы",
    text: "Мембрана и снегозащита для активных зимних маршрутов.",
  },
  {
    id: "kids",
    title: "С детьми",
    text: "Долгие прогулки без переохлаждения — руки свободны, ребёнок в тепле рядом.",
  },
];

export type FeatureCompact = {
  title: string;
  value: string;
};

export const featuresCompact: FeatureCompact[] = [
  { title: "Мембрана", value: "12000 мм" },
  { title: "Режим", value: "до −30 °C" },
  { title: "Подкладка", value: "Omni-heat" },
  { title: "Крой", value: "женский" },
  { title: "Размеры", value: "42–48 RU" },
  { title: "Швы", value: "проклеены" },
];
