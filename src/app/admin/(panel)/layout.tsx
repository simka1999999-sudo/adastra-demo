import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminConfigured, isAdminRequest } from "@/lib/admin-auth";
import { siteConfig } from "@/lib/site";
import { AdminBar } from "@/components/admin/AdminBar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (siteConfig.isStaticDemo) {
    return (
      <div className="container-page py-12">
        <h1 className="display text-3xl">Админка</h1>
        <p className="mt-4 max-w-xl text-ink-muted">
          На статическом демо GitHub Pages загрузка товаров недоступна: нет
          сервера. Админка работает на обычном хостинге с Node.
        </p>
      </div>
    );
  }
  if (!adminConfigured()) {
    return (
      <div className="container-page py-12">
        <h1 className="display text-3xl">Админка</h1>
        <p className="mt-4 max-w-xl text-ink-muted">
          Задайте <code className="text-ink">ADMIN_PASSWORD</code> в{" "}
          <code className="text-ink">.env</code> и перезапустите сервер.
        </p>
      </div>
    );
  }
  if (!(await isAdminRequest())) {
    redirect("/admin/login");
  }

  return (
    <div className="container-page py-10 md:py-12">
      <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
        Кабинет
      </p>
      <h1 className="display mt-2 text-[clamp(1.8rem,4vw,2.6rem)]">Товары и фото</h1>
      <AdminBar />
      {children}
    </div>
  );
}
