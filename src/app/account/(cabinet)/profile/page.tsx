import type { Metadata } from "next";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { ProfileForm } from "@/components/account/ProfileForm";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Профиль",
  description: "Контакты покупателя ADASTRA.",
  path: "/account/profile",
  index: false,
  follow: false,
});

export default async function ProfilePage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  return (
    <div>
      <h1 className="display text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.03em]">
        Профиль
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">
        Эти данные подставляются в новые заказы.
      </p>
      <div className="mt-8">
        <ProfileForm
          initial={{
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            city: customer.city,
            marketingOptIn: customer.marketingOptIn,
          }}
        />
      </div>
    </div>
  );
}
