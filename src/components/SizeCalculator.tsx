"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type SizeRow = {
  id: string;
  label: string;
  heightMin: number;
  heightMax: number;
  chestMin: number;
  chestMax: number;
  waistMin: number;
  waistMax: number;
  hipsMin: number;
  hipsMax: number;
};

const SIZE_ROWS: SizeRow[] = [
  {
    id: "42",
    label: "158 (42 RU)",
    heightMin: 154,
    heightMax: 160,
    chestMin: 84,
    chestMax: 88,
    waistMin: 66,
    waistMax: 70,
    hipsMin: 92,
    hipsMax: 96,
  },
  {
    id: "44-46",
    label: "164 (44–46 RU)",
    heightMin: 160,
    heightMax: 167,
    chestMin: 88,
    chestMax: 96,
    waistMin: 70,
    waistMax: 78,
    hipsMin: 96,
    hipsMax: 104,
  },
  {
    id: "46",
    label: "170 (46 RU)",
    heightMin: 167,
    heightMax: 173,
    chestMin: 92,
    chestMax: 96,
    waistMin: 74,
    waistMax: 78,
    hipsMin: 100,
    hipsMax: 104,
  },
  {
    id: "46-48",
    label: "176 (46–48 RU)",
    heightMin: 173,
    heightMax: 180,
    chestMin: 96,
    chestMax: 100,
    waistMin: 78,
    waistMax: 82,
    hipsMin: 104,
    hipsMax: 108,
  },
];

function scoreRow(
  row: SizeRow,
  height: number,
  chest: number,
  waist: number,
  hips: number,
) {
  const inRange = (v: number, min: number, max: number) =>
    v >= min && v <= max ? 0 : Math.min(Math.abs(v - min), Math.abs(v - max));
  return (
    inRange(height, row.heightMin, row.heightMax) * 1.2 +
    inRange(chest, row.chestMin, row.chestMax) +
    inRange(waist, row.waistMin, row.waistMax) +
    inRange(hips, row.hipsMin, row.hipsMax)
  );
}

export function SizeCalculator() {
  const [height, setHeight] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");

  const result = useMemo(() => {
    const h = Number(height);
    const c = Number(chest);
    const w = Number(waist);
    const hi = Number(hips);
    if (![h, c, w, hi].every((n) => n > 0)) return null;
    const ranked = [...SIZE_ROWS]
      .map((row) => ({ row, score: scoreRow(row, h, c, w, hi) }))
      .sort((a, b) => a.score - b.score);
    return ranked[0];
  }, [height, chest, waist, hips]);

  return (
    <section className="mt-12 border border-line bg-bg-elevated p-6 md:p-8">
      <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
        Шаг 2
      </p>
      <h2 className="display mt-3 text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.03em]">
        Сверьте с сеткой
      </h2>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">
        Введите мерки в сантиметрах — подскажем ближайший размер из сетки ADASTRA.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { id: "height", label: "Рост", value: height, set: setHeight },
          { id: "chest", label: "Обхват груди", value: chest, set: setChest },
          { id: "waist", label: "Талия", value: waist, set: setWaist },
          { id: "hips", label: "Обхват бёдер", value: hips, set: setHips },
        ].map((f) => (
          <div key={f.id}>
            <label className="label" htmlFor={f.id}>
              {f.label}, см
            </label>
            <input
              id={f.id}
              className="field"
              type="number"
              inputMode="numeric"
              min={40}
              max={220}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              placeholder="0"
            />
          </div>
        ))}
      </div>
      {result ? (
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase text-frost-deep">
            Рекомендуем
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {result.row.label}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {result.score === 0
              ? "Параметры точно попадают в размерную сетку."
              : "Ближайший размер по вашим меркам. При сомнении напишите нам — уточним до заказа."}
          </p>
          <p className="mt-4">
            <Link href="/catalog/kombinezony" className="chip">
              Смотреть комбинезоны
            </Link>
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-muted">
          Заполните все четыре поля, чтобы увидеть рекомендацию.
        </p>
      )}
    </section>
  );
}
