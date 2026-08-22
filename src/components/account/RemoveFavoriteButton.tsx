"use client";

import { useRouter } from "next/navigation";
import { accountRequest } from "@/components/account/api";

export function RemoveFavoriteButton({ productId }: { productId: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm text-ink-muted underline underline-offset-4"
      onClick={async () => {
        await accountRequest(`/api/account/wishlist/${productId}`, {
          method: "DELETE",
        });
        router.refresh();
      }}
    >
      Убрать
    </button>
  );
}
