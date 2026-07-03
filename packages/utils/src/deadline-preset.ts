import type { DeadlinePreset } from '@haedda/constants';
import {
  getMonthEndISO,
  getTodayISO,
  getTomorrowISO,
  getWeekEndISO,
  normalizeDeadline,
} from './date';

export function getDeadlineForPreset(
  preset: Exclude<DeadlinePreset, 'later'>,
  ref: Date = new Date()
): string {
  switch (preset) {
    case 'today':
      return getTodayISO();
    case 'tomorrow':
      return getTomorrowISO(ref);
    case 'week':
      return getWeekEndISO(ref);
    case 'month':
      return getMonthEndISO(ref);
  }
}

export function detectDeadlinePreset(
  deadline: string | undefined,
  ref: Date = new Date()
): DeadlinePreset | 'custom' {
  if (!deadline) return 'later';
  const normalized = normalizeDeadline(deadline);
  if (normalized === getTodayISO()) return 'today';
  if (normalized === getTomorrowISO(ref)) return 'tomorrow';
  if (normalized === getWeekEndISO(ref)) return 'week';
  if (normalized === getMonthEndISO(ref)) return 'month';
  return 'custom';
}

export function formatPresetHint(preset: DeadlinePreset, ref: Date = new Date()): string {
  switch (preset) {
    case 'today':
      return '오늘까지';
    case 'tomorrow':
      return '내일까지';
    case 'week':
      return '이번 주 일요일까지';
    case 'month':
      return '이번 달 말일까지';
    case 'later':
      return '기한 없이 저장돼요';
  }
}
