import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/AccountNav";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { firstName } from "@/lib/account-nav";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (siteConfig.isStaticDemo) {
    return (
      <div className="container-page py-12">
        <h1 className="display text-3xl">Личный кабинет</h1>
        <p className="mt-4 max-w-xl text-ink-muted">
          На статическом демо кабинета нет — он работает на сервере магазина.
        </p>
      </div>
    );
  }

  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/account/login?next=/account");
  }

  return (
    <div className="container-page py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
        <aside>
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
            Личный кабинет
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">
            {firstName(customer.name)}
          </p>
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
