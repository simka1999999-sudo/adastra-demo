import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { adminConfigured, isAdminRequest } from "@/lib/admin-auth";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Вход в админку",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (siteConfig.isStaticDemo) {
    return (
      <div className="container-page py-12">
        <h1 className="display text-3xl">Админка</h1>
        <p className="mt-4 max-w-xl text-ink-muted">
          На демо GitHub Pages кабинета нет — загрузка фото нужна на сервере
          магазина.
        </p>
      </div>
    );
  }
  if (!adminConfigured()) {
    return (
      <div className="container-page py-12">
        <h1 className="display text-3xl">Админка</h1>
        <p className="mt-4 text-ink-muted">
          Задайте ADMIN_PASSWORD в .env
        </p>
      </div>
    );
  }
  if (await isAdminRequest()) redirect("/admin");

  return (
    <div className="container-page py-12">
      <h1 className="display mb-6 text-3xl">Вход</h1>
      <p className="mb-4 max-w-sm text-sm text-ink-muted">
        Пароль только для этой страницы с товарами. Покупатели в каталог
        заходят без него.
      </p>
      <AdminLoginForm />
    </div>
  );
}
