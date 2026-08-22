import type { Metadata } from "next";
import { FindOrderForm } from "@/components/account/FindOrderForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Найти заказ",
  description: "Статус заказа ADASTRA по номеру и электронной почте.",
  path: "/account/find",
  index: false,
  follow: false,
});

export default function FindOrderPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Найти заказ" },
        ]}
      />
      <header className="mb-10 max-w-xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Найти заказ
        </h1>
        <p className="mt-4 text-ink-muted">
          Без входа: номер заказа и почта, которую указывали при оформлении.
        </p>
      </header>
      <FindOrderForm />
    </div>
  );
}
