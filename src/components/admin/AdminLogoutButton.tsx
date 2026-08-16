"use client";

import { useRouter } from "next/navigation";
import { withBasePath } from "@/lib/site";

export function AdminLogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch(withBasePath("/api/admin/logout"), { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button type="button" className="text-sm text-ink-muted underline underline-offset-4" onClick={() => void logout()}>
      Выйти
    </button>
  );
}
