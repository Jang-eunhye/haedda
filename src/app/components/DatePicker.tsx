'use client';

import { useMemo } from 'react';
import {
  formatDateISO,
  getDaysInMonth,
  getTodayISO,
  parseDateParts,
} from '../utils/date';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE = 3;

const selectClass =
  'flex-1 min-w-0 bg-background border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-colors appearance-none';

export default function DatePicker({ value, onChange }: Props) {
  const today = getTodayISO();
  const resolved = value || today;
  const { year, month, day } = parseDateParts(resolved);

  const years = useMemo(
    () => Array.from({ length: YEAR_RANGE }, (_, i) => CURRENT_YEAR + i),
    []
  );

  const daysInMonth = getDaysInMonth(year, month);
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const update = (nextYear: number, nextMonth: number, nextDay: number) => {
    const maxDay = getDaysInMonth(nextYear, nextMonth);
    const clampedDay = Math.min(nextDay, maxDay);
    onChange(formatDateISO(new Date(nextYear, nextMonth - 1, clampedDay)));
  };

  return (
    <div className="flex gap-2">
      <select
        value={year}
        onChange={e => update(Number(e.target.value), month, day)}
        className={selectClass}
        aria-label="연도"
      >
        {years.map(y => (
          <option key={y} value={y}>
            {y}년
          </option>
        ))}
      </select>

      <select
        value={month}
        onChange={e => update(year, Number(e.target.value), day)}
        className={selectClass}
        aria-label="월"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>

      <select
        value={day}
        onChange={e => update(year, month, Number(e.target.value))}
        className={selectClass}
        aria-label="일"
      >
        {days.map(d => (
          <option key={d} value={d}>
            {d}일
          </option>
        ))}
      </select>
    </div>
  );
}
