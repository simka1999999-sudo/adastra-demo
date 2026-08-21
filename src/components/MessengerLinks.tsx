import { siteConfig } from "@/lib/site";

const messengers = [
  {
    id: "telegram",
    label: "Telegram",
    href: siteConfig.social.telegram,
    className: "bg-[#229ED9]",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          fill="#fff"
          d="M21.5 4.3 18.2 20c-.2.9-.8 1.1-1.6.7l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.8.4l.3-4.6 8.4-7.6c.4-.3 0-.5-.6-.2l-10.4 6.5-4.5-1.4c-1-.3-1-.9.2-1.4L20 3.6c.8-.3 1.5.2 1.5.7Z"
        />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: siteConfig.social.whatsapp,
    className: "bg-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          fill="#fff"
          d="M12 2.1A9.9 9.9 0 0 0 3.4 16.8L2 22l5.3-1.4A9.9 9.9 0 1 0 12 2.1Zm5.8 14c-.2.7-1.3 1.2-1.8 1.3-.5.1-1 .2-3.3-.7-2.7-1.1-4.5-3.9-4.6-4.1-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.6c-.2.1-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.3 2.5 1.4.3.1.5.1.7-.1l.9-1c.2-.2.4-.2.6-.1.3.1 1.6.8 1.9.9.3.2.5.2.5.4Z"
        />
      </svg>
    ),
  },
  {
    id: "max",
    label: "Max",
    href: siteConfig.social.max,
    className: "bg-[linear-gradient(135deg,#471AFF_0%,#9500FF_100%)]",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path
          fill="#fff"
          d="M12.1 5.4c3.55 0 6.4 2.4 6.4 5.4 0 3-2.85 5.4-6.4 5.4-.78 0-1.52-.12-2.18-.34L6.15 18.3c-.32.14-.66-.2-.52-.52l.92-2.28C5.7 14.7 5.7 13.6 5.7 10.8c0-3 2.85-5.4 6.4-5.4Z"
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
    <div className={`flex items-center gap-1.5 ${className}`.trim()}>
      {messengers.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex size-9 shrink-0 items-center justify-center shadow-sm transition-opacity hover:opacity-80 md:size-10 ${
            item.id === "max" ? "rounded-[0.7rem]" : "rounded-full"
          } ${item.className}`}
          aria-label={item.label}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
