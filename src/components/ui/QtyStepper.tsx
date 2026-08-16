type Props = {
  id: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  label?: string;
};

export function QtyStepper({
  id,
  value,
  min = 1,
  max = 10,
  onChange,
  label = "Количество",
}: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="stepper">
      <button
        type="button"
        aria-label={`Уменьшить: ${label}`}
        disabled={value <= min}
        onClick={dec}
      >
        −
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/\D/g, ""));
          if (!n) {
            onChange(min);
            return;
          }
          onChange(Math.min(max, Math.max(min, n)));
        }}
      />
      <button
        type="button"
        aria-label={`Увеличить: ${label}`}
        disabled={value >= max}
        onClick={inc}
      >
        +
      </button>
    </div>
  );
}
