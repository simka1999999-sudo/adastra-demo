import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.allowIndexing) {
    return {
      rules: [
        { userAgent: "*", disallow: "/" },
        { userAgent: "Yandex", disallow: "/" },
        { userAgent: "Googlebot", disallow: "/" },
      ],
      host: siteConfig.url,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/order/", "/api/", "/account/", "/admin"],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/cart", "/checkout", "/order/", "/api/", "/account/", "/admin"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
