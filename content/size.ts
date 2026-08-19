export const sizeMeasurements = [
  {
    title: "Рост",
    text: "Измерьте свой рост в см.",
  },
  {
    title: "Обхват груди",
    text: "Измеряется горизонтально по выступающим точкам на груди.",
  },
  {
    title: "Обхват бёдер",
    text: "Измеряется по самым выступающим местам ягодиц.",
  },
];

export const brandSizes = [
  { id: "S", ru: "44", chestMin: 87, chestMax: 92, hipsMin: 92, hipsMax: 95 },
  { id: "M", ru: "46", chestMin: 93, chestMax: 96, hipsMin: 96, hipsMax: 100 },
  { id: "L", ru: "48", chestMin: 97, chestMax: 100, hipsMin: 101, hipsMax: 105 },
  { id: "XL", ru: "50", chestMin: 101, chestMax: 104, hipsMin: 106, hipsMax: 110 },
] as const;

export const heightGrades = [
  { id: "158", min: 155, max: 160 },
  { id: "164", min: 161, max: 166 },
  { id: "170", min: 167, max: 172 },
  { id: "176", min: 173, max: 178 },
] as const;

export function cmRange(min: number, max: number) {
  return `${min}–${max}`;
}
