export function ProductPhotoStub({
  caption = "Фото модели появится позже",
  className = "",
}: {
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full min-h-[12rem] w-full flex-col items-center justify-center bg-ice px-4 text-center ${className}`}
    >
      <p className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
        ADASTRA
      </p>
      <p className="mt-3 max-w-[16rem] text-sm text-ink-muted">{caption}</p>
    </div>
  );
}
