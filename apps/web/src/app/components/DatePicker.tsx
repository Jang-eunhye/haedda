'use client';

import { useEffect, useMemo, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {
  formatDateISO,
  getTodayISO,
  parseDateParts,
} from '@haedda/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function getCalendarCells(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  return cells;
}

export default function DatePicker({ value, onChange }: Props) {
  const today = getTodayISO();
  const resolved = value || today;
  const { year, month, day } = parseDateParts(resolved);

  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);

  useEffect(() => {
    setViewYear(year);
    setViewMonth(month);
  }, [year, month]);

  const cells = useMemo(
    () => getCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const moveMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth() + 1);
  };

  const selectDay = (nextDay: number) => {
    onChange(formatDateISO(new Date(viewYear, viewMonth - 1, nextDay)));
  };

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          aria-label="이전 달"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors active:scale-95"
        >
          <MdChevronLeft size={20} aria-hidden />
        </button>
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {viewYear}년 {viewMonth}월
        </span>
        <button
          type="button"
          onClick={() => moveMonth(1)}
          aria-label="다음 달"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors active:scale-95"
        >
          <MdChevronRight size={20} aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((label, index) => (
          <span
            key={label}
            className={`h-8 flex items-center justify-center text-[11px] font-medium ${
              index === 0 ? 'text-danger/70' : 'text-muted'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="날짜 선택">
        {cells.map((cellDay, index) => {
          if (cellDay === null) {
            return <span key={`empty-${index}`} className="h-9" aria-hidden />;
          }

          const iso = formatDateISO(new Date(viewYear, viewMonth - 1, cellDay));
          const isSelected = viewYear === year && viewMonth === month && cellDay === day;
          const isToday = iso === today;
          const isSunday = new Date(viewYear, viewMonth - 1, cellDay).getDay() === 0;

          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-label={`${viewMonth}월 ${cellDay}일`}
              onClick={() => selectDay(cellDay)}
              className={`h-9 rounded-lg text-sm font-medium tabular-nums transition-colors active:scale-95 ${
                isSelected
                  ? 'bg-foreground text-white'
                  : isToday
                    ? 'bg-surface text-foreground ring-1 ring-foreground/20 hover:bg-background'
                    : isSunday
                      ? 'text-danger/80 hover:bg-surface'
                      : 'text-foreground hover:bg-surface'
              }`}
            >
              {cellDay}
            </button>
          );
        })}
      </div>
    </div>
  );
}
