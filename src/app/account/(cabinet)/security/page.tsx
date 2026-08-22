import type { Metadata } from "next";
import {
  DeleteAccountButton,
  PasswordForm,
} from "@/components/account/SecurityForms";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Безопасность кабинета",
  description: "Смена пароля и удаление кабинета ADASTRA.",
  path: "/account/security",
  index: false,
  follow: false,
});

export default function SecurityPage() {
  return (
    <div>
      <h1 className="display text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.03em]">
        Безопасность
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">
        После смены пароля другие сессии закрываются.
      </p>
      <div className="mt-8">
        <PasswordForm />
      </div>
      <section className="mt-14 max-w-lg border-t border-line pt-8">
        <h2 className="text-xl">Удалить кабинет</h2>
        <p className="mt-3 text-sm text-ink-muted">
          Заказы останутся у магазина без привязки к профилю. Избранное и адреса
          удалятся.
        </p>
        <div className="mt-5">
          <DeleteAccountButton />
        </div>
      </section>
    </div>
  );
}
