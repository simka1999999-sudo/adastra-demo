/**
 * Посты Instagram @adastra_fashion.
 * Синхронизация: обновить вручную или через скрипт с Instagram Graph API
 * (нужен NEXT_PUBLIC_INSTAGRAM_USER_ID + INSTAGRAM_ACCESS_TOKEN).
 */
export type IgPost = {
  id: string;
  image: string;
  caption: string;
  url: string;
};

export const instagramHandle = "adastra_fashion";

export const instagramPosts: IgPost[] = [
  {
    id: "ig-1",
    image: "/lookbook/look-1.jpg",
    caption: "Зимний образ ADASTRA",
    url: "https://www.instagram.com/adastra_fashion/",
  },
  {
    id: "ig-2",
    image: "/lookbook/look-2.jpg",
    caption: "Комбинезон в городе",
    url: "https://www.instagram.com/adastra_fashion/",
  },
  {
    id: "ig-3",
    image: "/lookbook/look-3.jpg",
    caption: "На прогулке",
    url: "https://www.instagram.com/adastra_fashion/",
  },
  {
    id: "ig-4",
    image: "/lookbook/look-4.jpg",
    caption: "Lookbook",
    url: "https://www.instagram.com/adastra_fashion/",
  },
];
