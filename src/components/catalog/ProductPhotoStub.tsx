import Image from "next/image";

export function ProductPhotoStub({
  caption = "Фото модели появится позже",
  className = "",
}: {
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full min-h-[12rem] w-full flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#e8eef4_0%,#d5dee8_100%)] px-4 text-center ${className}`}
    >
      <Image
        src="/brand/logo-mark-dark.png"
        alt=""
        width={72}
        height={72}
        className="mb-4 opacity-25"
      />
      <p className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
        ADASTRA
      </p>
      <p className="mt-2 max-w-[16rem] text-sm text-ink-muted">{caption}</p>
    </div>
  );
}
