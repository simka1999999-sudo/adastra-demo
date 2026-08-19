"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { brandSizes, heightGrades } from "../../content/size";

function distanceToRange(value: number, min: number, max: number) {
  if (value >= min && value <= max) return 0;
  return Math.min(Math.abs(value - min), Math.abs(value - max));
}

export function SizeCalculator() {
  const [height, setHeight] = useState("");
  const [chest, setChest] = useState("");
  const [hips, setHips] = useState("");

  const result = useMemo(() => {
    const h = Number(height);
    const c = Number(chest);
    const hi = Number(hips);
    if (![h, c, hi].every((n) => n > 0)) return null;

    const brand = [...brandSizes]
      .map((size) => ({
        size,
        score:
          distanceToRange(c, size.chestMin, size.chestMax) +
          distanceToRange(hi, size.hipsMin, size.hipsMax),
      }))
      .sort((a, b) => a.score - b.score)[0];

    const grade = [...heightGrades]
      .map((row) => ({
        row,
        score: distanceToRange(h, row.min, row.max),
      }))
      .sort((a, b) => a.score - b.score)[0];

    return {
      brand: brand.size,
      grade: grade.row,
      exact: brand.score === 0 && grade.score === 0,
    };
  }, [height, chest, hips]);

  return (
    <section className="mt-12 border border-line bg-bg-elevated p-6 md:p-8">
      <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-frost-deep">
        Шаг 2
      </p>
      <h2 className="display mt-3 text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.03em]">
        Сверьте с сеткой
      </h2>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">
        Введите рост, обхват груди и обхват бёдер — подскажем размер бренда и
        ростовку.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { id: "height", label: "Рост", value: height, set: setHeight },
          { id: "chest", label: "Обхват груди", value: chest, set: setChest },
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
            {result.brand.id} · {result.brand.ru} RU, ростовка {result.grade.id}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {result.exact
              ? "Параметры точно попадают в размерную сетку."
              : "Ближайший размер по вашим меркам. Если не уверены — напишите нам до заказа."}
          </p>
          <p className="mt-4">
            <Link href="/catalog/kombinezony" className="chip">
              Смотреть комбинезоны
            </Link>
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-muted">
          Заполните три поля, чтобы увидеть рекомендацию.
        </p>
      )}
    </section>
  );
}
