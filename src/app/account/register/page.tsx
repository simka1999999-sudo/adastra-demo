import type { Metadata } from "next";
import { RegisterForm } from "@/components/account/RegisterForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Регистрация покупателя ADASTRA",
  description:
    "Регистрация в интернет-магазине ADASTRA: сохраните контакты для заказов и подбора размера.",
  path: "/account/register",
  index: false,
  follow: false,
});

export default function RegisterPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Регистрация" },
        ]}
      />
      <header className="mb-10 max-w-xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Регистрация
        </h1>
        <p className="mt-4 text-ink-muted">
          Оставьте контакты — так проще оформлять заказы и получать помощь с
          размером.
        </p>
      </header>
      <RegisterForm />
    </div>
  );
}
