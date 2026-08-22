import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/account/LoginForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Вход в личный кабинет",
  description: "Войдите в кабинет ADASTRA: заказы, избранное и адреса доставки.",
  path: "/account/login",
  index: false,
  follow: false,
});

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/account");

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Вход" },
        ]}
      />
      <header className="mb-10 max-w-xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Вход
        </h1>
        <p className="mt-4 text-ink-muted">
          Кабинет: история заказов, избранное, адреса и мерки.
        </p>
      </header>
      <Suspense fallback={<p className="text-ink-muted">Загрузка…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
