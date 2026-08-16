import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export function AdminBar() {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
      <div className="flex flex-wrap gap-4 text-sm font-medium">
        <Link href="/admin" className="underline-offset-4 hover:underline">
          Товары
        </Link>
        <Link href="/admin/products/new" className="underline-offset-4 hover:underline">
          Новый товар
        </Link>
        <Link href="/admin/import" className="underline-offset-4 hover:underline">
          Excel
        </Link>
        <Link href="/catalog" className="text-ink-muted underline-offset-4 hover:underline">
          Витрина
        </Link>
      </div>
      <AdminLogoutButton />
    </div>
  );
}
