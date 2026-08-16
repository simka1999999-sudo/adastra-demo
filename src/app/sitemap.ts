import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.allowIndexing) return [];

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/catalog", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/lookbook", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/reviews", priority: 0.75, changeFrequency: "weekly" as const },
    { path: "/size-guide", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/delivery", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/returns", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contacts", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/partners", priority: 0.55, changeFrequency: "monthly" as const },
    { path: "/offer", priority: 0.4, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/catalog/${c.slug}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.inStock)
    .map((p) => ({
      url: absoluteUrl(`/catalog/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
