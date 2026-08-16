"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { mainNav } from "@/lib/nav";
import { formatPhoneDisplay, siteConfig, socialNav } from "@/lib/site";

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !isHome || scrolled || open;
  const tone = solid ? "text-ink" : "text-white";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-b border-line/90 bg-[color-mix(in_srgb,var(--bg)_88%,white)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-page flex min-h-[var(--nav-h)] items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              className={`text-sm font-semibold tracking-[0.12em] uppercase md:text-base ${tone}`}
              aria-expanded={open}
              aria-controls="side-nav"
              onClick={() => setOpen(true)}
            >
              Меню
            </button>
            <Link href="/" className="relative block h-10 w-56 sm:h-11 sm:w-64 md:h-12 md:w-72">
              <Image
                src={
                  solid
                    ? "/brand/logo-wordmark-dark.png"
                    : "/brand/logo-wordmark-light.png"
                }
                alt="ADASTRA"
                fill
                className="object-contain object-left"
                sizes="(max-width: 640px) 224px, 288px"
                priority
              />
            </Link>
          </div>

          <div className={`flex items-center gap-5 sm:gap-7 ${tone}`}>
            <div className="hidden text-right md:block">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="text-sm font-semibold tracking-wide md:text-base"
              >
                {formatPhoneDisplay()}
              </a>
              <p className="mt-0.5 text-xs leading-snug text-current/85 md:text-sm">
                {siteConfig.hours}
              </p>
            </div>
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase"
              aria-label={`Корзина, товаров: ${count}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 7h12l-1 13H7L6 7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 7a3 3 0 0 1 6 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="tabular-nums">{count}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Left drawer */}
      <div
        className={`fixed inset-0 z-[60] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          aria-label="Закрыть меню"
          onClick={() => setOpen(false)}
        />
        <nav
          id="side-nav"
          className={`absolute inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col border-r border-line bg-bg-elevated text-ink shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <span className="relative block h-10 w-56">
              <Image
                src="/brand/logo-wordmark-dark.png"
                alt="ADASTRA"
                fill
                className="object-contain object-left"
                sizes="224px"
              />
            </span>
            <button
              type="button"
              className="text-sm font-semibold tracking-[0.12em] uppercase text-ink-muted"
              onClick={() => setOpen(false)}
            >
              Закрыть
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto px-6 py-4">
            {mainNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block border-b border-line/70 py-4 text-base font-semibold tracking-[0.1em] uppercase transition-colors ${
                      active ? "text-ink" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-line px-6 py-5 text-base">
            <a href={`tel:${siteConfig.phoneRaw}`} className="font-semibold">
              {formatPhoneDisplay()}
            </a>
            <p className="mt-1 text-sm text-ink-muted">{siteConfig.hours}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold tracking-[0.08em] uppercase text-ink-muted">
              {socialNav.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
