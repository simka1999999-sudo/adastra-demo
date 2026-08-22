import type { Metadata } from "next";
import { ForgotForm } from "@/components/account/ForgotForm";
import { RecoverForm } from "@/components/account/RecoverForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Восстановление доступа",
  description: "Сброс пароля кабинета ADASTRA по почте или номеру заказа.",
  path: "/account/forgot",
  index: false,
  follow: false,
});

export default function ForgotPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Главная", path: "/" },
          { name: "Восстановление доступа" },
        ]}
      />
      <header className="mb-10 max-w-xl">
        <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">
          Забыли пароль
        </h1>
        <p className="mt-4 text-ink-muted">
          Пришлём ссылку на почту или восстановим доступ по номеру заказа.
        </p>
      </header>
      <ForgotForm />
      <section className="mt-14 max-w-lg border-t border-line pt-10">
        <h2 className="text-xl">Есть номер заказа</h2>
        <p className="mt-3 mb-6 text-sm text-ink-muted">
          Если письма нет — укажите почту из заказа и его номер.
        </p>
        <RecoverForm />
      </section>
    </div>
  );
}
