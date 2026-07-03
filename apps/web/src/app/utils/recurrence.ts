import { Todo, TodoRecurrence } from '@haedda/types';
import { WEEKDAY_LABELS } from '@haedda/constants';
import { formatDateISO, formatDeadlineLabel, getDaysInMonth, parseDateParts } from './date';

export { WEEKDAY_LABELS };

export function isRecurringTodo(recurrence?: TodoRecurrence): boolean {
  return !!recurrence;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getLastDayOfMonth(year: number, month: number): number {
  return getDaysInMonth(year, month);
}

function clampDayOfMonth(year: number, month: number, day: number): number {
  return Math.min(day, getLastDayOfMonth(year, month));
}

function getMonthlyDeadlineDate(
  year: number,
  month: number,
  dayOfMonth: number | 'last'
): Date {
  if (dayOfMonth === 'last') {
    const lastDay = getLastDayOfMonth(year, month);
    return new Date(year, month - 1, lastDay);
  }
  const day = clampDayOfMonth(year, month, dayOfMonth);
  return new Date(year, month - 1, day);
}

function parseISODate(iso: string): Date {
  const { year, month, day } = parseDateParts(iso);
  return new Date(year, month - 1, day);
}

/** 다음 마감일 계산. includeToday=true면 오늘도 후보 */
export function computeNextDeadline(
  recurrence: TodoRecurrence,
  from: Date = new Date(),
  includeToday = false
): string {
  const today = startOfDay(from);

  if (recurrence.type === 'daily') {
    if (includeToday) return formatDateISO(today);
    return formatDateISO(addDays(today, 1));
  }

  if (recurrence.type === 'weekly') {
    const weekdays = recurrence.weekdays ?? [];
    if (weekdays.length === 0) return formatDateISO(today);

    const startOffset = includeToday ? 0 : 1;
    for (let i = startOffset; i < startOffset + 14; i++) {
      const candidate = addDays(today, i);
      if (weekdays.includes(candidate.getDay())) {
        return formatDateISO(candidate);
      }
    }
    return formatDateISO(addDays(today, 7));
  }

  if (recurrence.type === 'monthly') {
    return computeNextMonthlyDeadline(recurrence, today, includeToday);
  }

  return formatDateISO(today);
}

/** 완료 후 다음 마감일 — 현재 마감일 이후의 다음 주기 */
export function computeNextDeadlineAfter(
  recurrence: TodoRecurrence,
  currentDeadline: string
): string {
  const after = startOfDay(parseISODate(currentDeadline));

  if (recurrence.type === 'daily') {
    return formatDateISO(addDays(after, 1));
  }

  if (recurrence.type === 'weekly') {
    const weekdays = recurrence.weekdays ?? [];
    if (weekdays.length === 0) return formatDateISO(addDays(after, 1));

    for (let i = 1; i <= 14; i++) {
      const candidate = addDays(after, i);
      if (weekdays.includes(candidate.getDay())) {
        return formatDateISO(candidate);
      }
    }
    return formatDateISO(addDays(after, 7));
  }

  if (recurrence.type === 'monthly') {
    return computeNextMonthlyDeadline(recurrence, after, false);
  }

  return formatDateISO(addDays(after, 1));
}

function computeNextMonthlyDeadline(
  recurrence: TodoRecurrence,
  from: Date,
  includeToday: boolean
): string {
  const dayOfMonth = recurrence.dayOfMonth ?? 1;
  let year = from.getFullYear();
  let month = from.getMonth() + 1;

  for (let attempt = 0; attempt < 24; attempt++) {
    const candidate = getMonthlyDeadlineDate(year, month, dayOfMonth);
    if (includeToday ? candidate >= from : candidate > from) {
      return formatDateISO(candidate);
    }
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return formatDateISO(from);
}

export function formatRecurrenceLabel(recurrence: TodoRecurrence): string {
  if (recurrence.type === 'daily') return '매일';

  if (recurrence.type === 'weekly') {
    const labels = WEEKDAY_LABELS.filter(w =>
      (recurrence.weekdays ?? []).includes(w.value)
    ).map(w => w.label);
    return labels.length > 0 ? `매주 ${labels.join('·')}` : '매주';
  }

  if (recurrence.type === 'monthly') {
    if (recurrence.dayOfMonth === 'last') return '매월 말일';
    return `매월 ${recurrence.dayOfMonth}일`;
  }

  return '';
}

function getWeekStartMonday(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  return addDays(d, -daysSinceMonday);
}

/** 이번 주기(오늘 포함 당일·이번 주·이번 달)의 마감일 */
export function computeCurrentPeriodDeadline(
  recurrence: TodoRecurrence,
  from: Date = new Date()
): string {
  const today = startOfDay(from);

  if (recurrence.type === 'daily') {
    return formatDateISO(today);
  }

  if (recurrence.type === 'weekly') {
    const weekdays = recurrence.weekdays ?? [];
    if (weekdays.length === 0) return formatDateISO(today);

    const weekStart = getWeekStartMonday(today);
    const inWeek: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const candidate = addDays(weekStart, i);
      if (weekdays.includes(candidate.getDay())) inWeek.push(candidate);
    }
    if (inWeek.length === 0) return computeNextDeadline(recurrence, today, true);

    const passed = inWeek.filter(d => d <= today);
    if (passed.length > 0) return formatDateISO(passed[passed.length - 1]);
    return formatDateISO(inWeek[0]);
  }

  if (recurrence.type === 'monthly') {
    const dayOfMonth = recurrence.dayOfMonth ?? 1;
    return formatDateISO(
      getMonthlyDeadlineDate(today.getFullYear(), today.getMonth() + 1, dayOfMonth)
    );
  }

  return formatDateISO(today);
}

export function countMissedPeriods(
  recurrence: TodoRecurrence,
  storedDeadline: string,
  currentPeriodDeadline: string
): number {
  if (storedDeadline >= currentPeriodDeadline) return 0;

  let missed = 0;
  let cursor = storedDeadline;
  while (cursor < currentPeriodDeadline) {
    cursor = computeNextDeadlineAfter(recurrence, cursor);
    missed += 1;
  }
  return missed;
}

export function getRecurrenceStatus(todo: {
  recurrence?: TodoRecurrence;
  missedCount?: number;
  consecutiveCompletions?: number;
}): { label: string; variant: 'missed' | 'streak' } | null {
  if (!todo.recurrence) return null;
  const missed = todo.missedCount ?? 0;
  const streak = todo.consecutiveCompletions ?? 0;
  if (missed > 0) return { label: `미완료 ${missed}회`, variant: 'missed' };
  if (streak > 0) return { label: `${streak}회 연속 완료`, variant: 'streak' };
  return null;
}

export function formatRecurrenceStatus(todo: {
  recurrence?: TodoRecurrence;
  missedCount?: number;
  consecutiveCompletions?: number;
}): string | null {
  return getRecurrenceStatus(todo)?.label ?? null;
}

/** 만료된 반복 할일을 이번 주기 마감일로 갱신하고 미완료 횟수 누적 */
export function refreshRecurringTodo(todo: Todo): Todo {
  if (!todo.recurrence) return todo;

  const currentPeriod = computeCurrentPeriodDeadline(todo.recurrence);
  const stored = todo.deadline;

  if (!stored) {
    return {
      ...todo,
      deadline: currentPeriod,
      missedCount: todo.missedCount ?? 0,
      consecutiveCompletions: todo.consecutiveCompletions ?? 0,
    };
  }

  if (stored >= currentPeriod) {
    return {
      ...todo,
      missedCount: todo.missedCount ?? 0,
      consecutiveCompletions: todo.consecutiveCompletions ?? 0,
    };
  }

  const additionalMissed = countMissedPeriods(todo.recurrence, stored, currentPeriod);

  return {
    ...todo,
    deadline: currentPeriod,
    missedCount: (todo.missedCount ?? 0) + additionalMissed,
    consecutiveCompletions: todo.consecutiveCompletions ?? 0,
  };
}

export function formatRecurrenceDeadline(recurrence: TodoRecurrence, deadline: string): string {
  const dateLabel = formatDeadlineLabel(deadline);
  if (recurrence.type === 'daily') return `오늘까지 · ${dateLabel}`;
  return `${formatRecurrenceLabel(recurrence)} · ${dateLabel}`;
}
