export function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{children}</p>
  );
}

export function AdminNote({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-line bg-ice/50 p-4 text-sm leading-relaxed text-ink-muted">
      {title ? <p className="mb-2 font-medium text-ink">{title}</p> : null}
      {children}
    </div>
  );
}
