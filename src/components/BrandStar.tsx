/** Четырёхконечный знак ADASTRA — без треугольной «А» из вордмарка. */
export function BrandStar({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 1.2 14.7 9.3 22.8 12 14.7 14.7 12 22.8 9.3 14.7 1.2 12 9.3 9.3 12 1.2Zm0 8.3L10.5 12 12 14.5 13.5 12 12 9.5Z"
      />
    </svg>
  );
}
