import Link from "next/link";

export function AccountHeaderLink({ toneClass }: { toneClass: string }) {
  return (
    <Link
      href="/account"
      className={`inline-flex size-10 items-center justify-center ${toneClass}`}
      aria-label="Личный кабинет"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.5 19.2c.9-3.2 3.4-5.2 6.5-5.2s5.6 2 6.5 5.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
