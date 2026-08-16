"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { withBasePath } from "@/lib/site";

export function DeleteProductButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    if (!window.confirm(`Удалить «${title}» с витрины? Фото из загрузок тоже сотрутся.`)) {
      return;
    }
    setPending(true);
    setError("");
    try {
      const res = await fetch(withBasePath(`/api/admin/products/${id}`), {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Не удалилось");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="text-sm text-danger underline underline-offset-4"
        disabled={pending}
        onClick={() => void onDelete()}
      >
        {pending ? "Удаляем…" : "Удалить товар"}
      </button>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
