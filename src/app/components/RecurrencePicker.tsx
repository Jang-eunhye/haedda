'use client';

import { TodoRecurrence } from '../types';
import { WEEKDAY_LABELS } from '../utils/recurrence';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

interface Props {
  frequency: RecurrenceFrequency;
  onFrequencyChange: (frequency: RecurrenceFrequency) => void;
  weekdays: number[];
  onWeekdaysChange: (weekdays: number[]) => void;
  monthlyMode: 'day' | 'last';
  onMonthlyModeChange: (mode: 'day' | 'last') => void;
  dayOfMonth: number;
  onDayOfMonthChange: (day: number) => void;
}

const FREQUENCIES: { key: RecurrenceFrequency; label: string }[] = [
  { key: 'daily', label: '매일' },
  { key: 'weekly', label: '매주' },
  { key: 'monthly', label: '매달' },
];

export default function RecurrencePicker({
  frequency,
  onFrequencyChange,
  weekdays,
  onWeekdaysChange,
  monthlyMode,
  onMonthlyModeChange,
  dayOfMonth,
  onDayOfMonthChange,
}: Props) {
  const toggleWeekday = (value: number) => {
    onWeekdaysChange(
      weekdays.includes(value)
        ? weekdays.filter(d => d !== value)
        : [...weekdays, value]
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex p-1 bg-background rounded-2xl">
        {FREQUENCIES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFrequencyChange(key)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              frequency === key
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {frequency === 'weekly' && (
        <div className="pt-1">
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAY_LABELS.map(({ value, label }) => {
              const selected = weekdays.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleWeekday(value)}
                  aria-pressed={selected}
                  className={`aspect-square flex items-center justify-center rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    selected
                      ? 'bg-foreground text-white border border-foreground'
                      : 'text-muted border border-border bg-surface hover:text-foreground hover:border-foreground/20'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {frequency === 'monthly' && (
        <div className="pt-1 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="monthly-mode"
              checked={monthlyMode === 'last'}
              onChange={() => onMonthlyModeChange('last')}
              className="sr-only"
            />
            <span
              className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                monthlyMode === 'last' ? 'border-foreground' : 'border-border'
              }`}
            >
              {monthlyMode === 'last' && (
                <span className="w-2.5 h-2.5 rounded-full bg-foreground" />
              )}
            </span>
            <span className="text-sm font-semibold text-foreground">매월 말일</span>
          </label>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="monthly-mode"
                checked={monthlyMode === 'day'}
                onChange={() => onMonthlyModeChange('day')}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  monthlyMode === 'day' ? 'border-foreground' : 'border-border'
                }`}
              >
                {monthlyMode === 'day' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground" />
                )}
              </span>
              <span className="text-sm font-semibold text-foreground">지정날짜</span>
            </label>

            {monthlyMode === 'day' && (
              <div className="flex items-center gap-2 mt-2.5 pl-8">
                <span className="text-sm text-muted shrink-0">매월</span>
                <select
                  value={dayOfMonth}
                  onChange={e => onDayOfMonthChange(Number(e.target.value))}
                  className="flex-1 min-w-0 bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>
                      {d}일
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function buildRecurrenceFromForm(
  isRecurring: boolean,
  frequency: RecurrenceFrequency,
  weekdays: number[],
  monthlyMode: 'day' | 'last',
  dayOfMonth: number
): TodoRecurrence | undefined {
  if (!isRecurring) return undefined;
  if (frequency === 'daily') return { type: 'daily' };
  if (frequency === 'weekly') return { type: 'weekly', weekdays: [...weekdays].sort() };
  if (frequency === 'monthly') {
    return {
      type: 'monthly',
      dayOfMonth: monthlyMode === 'last' ? 'last' : dayOfMonth,
    };
  }
  return undefined;
}

export function getFrequencyFromTodo(
  recurrence?: TodoRecurrence
): RecurrenceFrequency {
  if (!recurrence) return 'daily';
  return recurrence.type;
}
