import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/account/RegisterForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Регистрация покупателя ADASTRA",
  description:
    "Регистрация в интернет-магазине ADASTRA: сохраните контакты для заказов и подбора размера.",
  path: "/account/register",
  index: false,
  follow: false,
});

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/account");

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
          Создайте кабинет: заказы, избранное, адреса и подбор размера.
        </p>
      </header>
      <RegisterForm />
    </div>
  );
}
