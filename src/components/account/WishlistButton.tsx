"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accountRequest } from "@/components/account/api";

export function WishlistButton({
  productId,
  slug,
  initialWished = false,
}: {
  productId: string;
  slug: string;
  initialWished?: boolean;
}) {
  const router = useRouter();
  const [wished, setWished] = useState(initialWished);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await accountRequest<{ items: { productId: string }[] }>(
          "/api/account/wishlist",
        );
        if (!cancelled) {
          setWished(data.items.some((item) => item.productId === productId));
        }
      } catch {
        /* гость */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function toggle() {
    if (pending) return;
    setPending(true);
    try {
      if (wished) {
        await accountRequest(`/api/account/wishlist/${productId}`, {
          method: "DELETE",
        });
        setWished(false);
      } else {
        await accountRequest("/api/account/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId, slug }),
        });
        setWished(true);
      }
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Войдите")) {
        router.push(`/account/login?next=${encodeURIComponent(`/catalog/${slug}`)}`);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className="btn-ghost btn w-full sm:w-auto"
      disabled={pending}
      onClick={() => void toggle()}
      aria-pressed={wished}
    >
      {wished ? "В избранном" : "В избранное"}
    </button>
  );
}
