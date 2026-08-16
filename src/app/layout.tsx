import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { YandexMetrika } from "@/components/YandexMetrika";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { DemoBanner } from "@/components/DemoBanner";
import "./globals.css";

/** Шрифт из бренд-пака дизайнера (DropMeFiles FPAZ8). Futura без кириллицы — не используем. */
const jost = localFont({
  src: [
    { path: "../../public/fonts/jost/Jost-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/jost/Jost-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/jost/Jost-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../public/fonts/jost/Jost-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/jost/Jost-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/jost/Jost-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ADASTRA — бренд утеплённой одежды",
    template: "%s · ADASTRA",
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: siteConfig.name,
  },
  robots: siteConfig.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${jost.variable} h-full ${siteConfig.allowIndexing ? "" : "demo-closed"}`}
    >
      <body className={`${jost.className} flex min-h-full flex-col antialiased`}>
        <CartProvider>
          <DemoBanner />
          <Header />
          <main className="flex-1 pt-[var(--header-h)]">{children}</main>
          <Footer />
        </CartProvider>
        <YandexMetrika />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
