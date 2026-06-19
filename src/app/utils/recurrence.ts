import { MissionRecurrence } from '../types';
import { formatDateISO, formatDeadlineLabel, getDaysInMonth } from './date';

export const WEEKDAY_LABELS: { value: number; label: string }[] = [
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
  { value: 0, label: '일' },
];

export function isRecurringMission(recurrence?: MissionRecurrence): boolean {
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

/** 다음 마감일 계산. includeToday=true면 오늘도 후보 */
export function computeNextDeadline(
  recurrence: MissionRecurrence,
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
    const dayOfMonth = recurrence.dayOfMonth ?? 1;
    let year = today.getFullYear();
    let month = today.getMonth() + 1;

    for (let attempt = 0; attempt < 24; attempt++) {
      const candidate = getMonthlyDeadlineDate(year, month, dayOfMonth);
      if (includeToday ? candidate >= today : candidate > today) {
        return formatDateISO(candidate);
      }
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  }

  return formatDateISO(today);
}

export function formatRecurrenceLabel(recurrence: MissionRecurrence): string {
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

export function formatRecurrenceDeadline(recurrence: MissionRecurrence, deadline: string): string {
  const dateLabel = formatDeadlineLabel(deadline);
  if (recurrence.type === 'daily') return `오늘까지 · ${dateLabel}`;
  return `${formatRecurrenceLabel(recurrence)} · ${dateLabel}`;
}
