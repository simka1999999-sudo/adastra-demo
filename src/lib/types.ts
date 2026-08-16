export type ProductSize = {
  id: string;
  label: string;
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  price: number;
  oldPrice?: number;
  category: "overalls" | "jackets" | "coats" | "pants";
  gender: "women" | "men" | "unisex";
  colors: string[];
  collection: string;
  season: string;
  country: string;
  materials: string;
  insulation: string;
  temperature: string;
  description: string;
  features: string[];
  images: string[];
  sizes: ProductSize[];
  seo: {
    title: string;
    description: string;
  };
  inStock: boolean;
  featured?: boolean;
  /** Master SKU без размера, напр. 11blue → варианты 11blue_122 */
  masterSku?: string;
  isNew?: boolean;
  isHit?: boolean;
  /** Порядок хитов на витрине (меньше — выше). */
  hitRank?: number;
  colorGroup?: string | null;
  care?: string;
  ozonId?: number | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  sizeId: string;
  sizeLabel: string;
  quantity: number;
  image: string;
};

export type DeliveryType = "cdek" | "ozon";
export type PaymentOption = "cod" | "online";
