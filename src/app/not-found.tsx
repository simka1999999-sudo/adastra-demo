import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="display text-[clamp(2.2rem,4vw,3.2rem)] tracking-[-0.04em]">Страница не найдена</h1>
      <p className="mt-4 text-ink-muted">Возможно, ссылка устарела или была изменена.</p>
      <Link href="/" className="btn mt-8 inline-flex">
        На главную
      </Link>
    </div>
  );
}
