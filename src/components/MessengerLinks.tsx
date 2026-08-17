import { siteConfig } from "@/lib/site";

const messengers = [
  {
    id: "telegram",
    label: "Telegram",
    short: "TG",
    href: siteConfig.social.telegram,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          fill="currentColor"
          d="M21.5 4.3 18.2 20c-.2.9-.8 1.1-1.6.7l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.8.4l.3-4.6 8.4-7.6c.4-.3 0-.5-.6-.2l-10.4 6.5-4.5-1.4c-1-.3-1-.9.2-1.4L20 3.6c.8-.3 1.5.2 1.5.7Z"
        />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    short: "WA",
    href: siteConfig.social.whatsapp,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2.1A9.9 9.9 0 0 0 3.4 16.8L2 22l5.3-1.4A9.9 9.9 0 1 0 12 2.1Zm5.8 14c-.2.7-1.3 1.2-1.8 1.3-.5.1-1 .2-3.3-.7-2.7-1.1-4.5-3.9-4.6-4.1-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.6c-.2.1-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.3 2.5 1.4.3.1.5.1.7-.1l.9-1c.2-.2.4-.2.6-.1.3.1 1.6.8 1.9.9.3.2.5.2.5.4Z"
        />
      </svg>
    ),
  },
  {
    id: "max",
    label: "Max",
    short: "Max",
    href: siteConfig.social.max,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          fill="currentColor"
          d="M4.2 6.2h3.1l2.5 6.2h.1l2.6-6.2h3.1v11.6h-2.5V10h-.1l-2.5 6.2H9.2L6.7 10h-.1v7.8H4.2V6.2Zm13.2 0H20v11.6h-2.6V6.2Z"
        />
      </svg>
    ),
  },
];

export function MessengerLinks({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 ${className}`.trim()}>
      {messengers.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-current/30 px-2.5 text-[0.7rem] font-semibold tracking-wide uppercase transition-opacity hover:opacity-70 md:h-10 md:w-10 md:justify-center md:px-0 md:text-[0]"
          aria-label={item.label}
        >
          {item.icon}
          <span className="md:hidden">{item.short}</span>
        </a>
      ))}
    </div>
  );
}
