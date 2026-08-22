import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetForm } from "@/components/account/ResetForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Новый пароль",
  description: "Задайте новый пароль кабинета ADASTRA.",
  path: "/account/reset",
  index: false,
  follow: false,
});

export default function ResetPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Новый пароль" },
        ]}
      />
      <header className="mb-10 max-w-xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Новый пароль
        </h1>
        <p className="mt-4 text-ink-muted">
          Ссылка из письма действует один час.
        </p>
      </header>
      <Suspense fallback={<p className="text-ink-muted">Загрузка…</p>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
