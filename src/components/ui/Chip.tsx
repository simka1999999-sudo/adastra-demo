import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "idle" | "active" | "disabled";

function chipClass(tone: Tone, className = "") {
  const state =
    tone === "active"
      ? "chip-active"
      : tone === "disabled"
        ? "chip-disabled"
        : "";
  return `chip ${state} ${className}`.trim();
}

export function ChipLink({
  href,
  active = false,
  children,
  className = "",
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={chipClass(active ? "active" : "idle", className)}
    >
      {children}
    </Link>
  );
}

export function ChipButton({
  active = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      type="button"
      disabled={disabled}
      aria-pressed={active}
      className={chipClass(disabled ? "disabled" : active ? "active" : "idle", className)}
    >
      {children}
    </button>
  );
}
