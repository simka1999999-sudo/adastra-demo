import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { SizeForm } from "@/components/account/SizeForm";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Мой размер",
  description: "Мерки и размер для заказов ADASTRA.",
  path: "/account/size",
  index: false,
  follow: false,
});

export default async function SizePage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  return (
    <div>
      <h1 className="display text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.03em]">
        Размер
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">
        Сохраните рост и мерки — менеджеру проще подтвердить ростовку. Таблица
        есть на странице{" "}
        <Link href="/size-guide" className="underline underline-offset-4">
          как выбрать размер
        </Link>
        .
      </p>
      <div className="mt-8">
        <SizeForm
          initial={{
            heightCm: customer.heightCm,
            sizeRu: customer.sizeRu,
            chestCm: customer.chestCm,
            waistCm: customer.waistCm,
            hipsCm: customer.hipsCm,
          }}
        />
      </div>
    </div>
  );
}
