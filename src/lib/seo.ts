import type { Metadata } from "next";
import type { Product } from "@/lib/types";
import type { CategorySeo, FaqItem } from "../../content/seo/categories";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { categoryLabels, storefrontImages } from "@/lib/products";

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  index?: boolean;
  follow?: boolean;
  /** Если false — не ставим canonical (редкий кейс). По умолчанию path. */
  canonical?: string | false;
};

/** Единый билдер meta/OG/Twitter/robots — все публичные страницы через него. */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  index = true,
  follow = true,
  canonical = path,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image || "/brand/logo-wordmark-dark.png");
  const canonicalPath = canonical === false ? undefined : canonical;
  const canIndex = siteConfig.allowIndexing && index;
  const canFollow = siteConfig.allowIndexing && follow;

  return {
    title,
    description,
    alternates: canonicalPath
      ? { canonical: canonicalPath }
      : undefined,
    robots: {
      index: canIndex,
      follow: canFollow,
      nocache: !canIndex,
      googleBot: { index: canIndex, follow: canFollow, noimageindex: !canIndex },
    },
    openGraph: {
      type,
      locale: "ru_RU",
      siteName: siteConfig.name,
      title,
      description,
      url,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Фильтры color/size/sort — тонкий контент: noindex + canonical на чистый URL. */
export function catalogQueryFlags(sp: {
  color?: string;
  size?: string;
  sort?: string;
  category?: string;
  collection?: string;
}) {
  const hasFacet = Boolean(sp.color || sp.size || sp.sort || sp.collection);
  return {
    hasFacet,
    indexable: !hasFacet,
  };
}

export function organizationJsonLd() {
  const legal = siteConfig.legal;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: legal.fullName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    taxID: legal.inn,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Большая Почтовая, д. 32, 28",
      addressLocality: "Москва",
      postalCode: "105082",
      addressCountry: "RU",
    },
    logo: absoluteUrl("/brand/logo-mark-dark.png"),
    openingHours: "Mo-Su 10:00-20:00",
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.telegram,
      siteConfig.social.max,
      siteConfig.social.youtube,
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "ru-RU",
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function faqJsonLd(faq: FaqItem[]) {
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function productJsonLd(product: Product) {
  const images = storefrontImages(product).map((src) => absoluteUrl(src));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    ...(images.length ? { image: images } : {}),
    sku: product.masterSku || product.id,
    brand: { "@type": "Brand", name: "ADASTRA" },
    category: categoryLabels[product.category],
    color: product.colors.join(", "),
    material: product.materials,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/catalog/${product.slug}`),
      priceCurrency: "RUB",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };
}

export function itemListJsonLd(
  name: string,
  path: string,
  products: Product[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/catalog/${p.slug}`),
      name: p.title,
    })),
  };
}

export function categoryPath(category: CategorySeo | Product["category"]) {
  if (typeof category === "string") {
    return `/catalog/${category}`;
  }
  return `/catalog/${category.slug}`;
}
