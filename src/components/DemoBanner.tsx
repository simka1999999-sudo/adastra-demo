import { siteConfig } from "@/lib/site";

export function DemoBanner() {
  if (siteConfig.allowIndexing) return null;
  return (
    <p className="fixed inset-x-0 top-0 z-[70] bg-ink px-4 py-2 text-center text-xs font-semibold tracking-[0.1em] text-white uppercase sm:text-sm sm:tracking-[0.12em]">
      Демо-витрина · закрыта от индексации Яндекса и Google
    </p>
  );
}
