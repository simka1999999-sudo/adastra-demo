import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getProductById } from "@/lib/catalog-query";
import { ProductCard } from "@/components/catalog/ProductCard";
import { RemoveFavoriteButton } from "@/components/account/RemoveFavoriteButton";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Избранное",
  description: "Сохранённые модели ADASTRA.",
  path: "/account/favorites",
  index: false,
  follow: false,
});

export default async function FavoritesPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  const items = await prisma.wishlistItem.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="display text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.03em]">
        Избранное
      </h1>
      {items.length ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {items.map((item) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <div key={item.id}>
                <ProductCard product={product} />
                <div className="mt-3">
                  <RemoveFavoriteButton productId={item.productId} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-ink-muted">
          Пока пусто. Откройте карточку товара и нажмите «В избранное».{" "}
          <Link href="/catalog" className="underline underline-offset-4">
            В каталог
          </Link>
        </p>
      )}
    </div>
  );
}
