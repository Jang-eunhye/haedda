import type { TodoRecurrence } from '@haedda/types';

export function normalizeRecurrence(raw: unknown): TodoRecurrence | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  if (r.type === 'daily') return { type: 'daily' };
  if (r.type === 'weekly' && Array.isArray(r.weekdays)) {
    const weekdays = r.weekdays.filter((d): d is number => typeof d === 'number');
    return weekdays.length > 0 ? { type: 'weekly', weekdays } : undefined;
  }
  if (r.type === 'monthly') {
    if (r.dayOfMonth === 'last') return { type: 'monthly', dayOfMonth: 'last' };
    if (typeof r.dayOfMonth === 'number') {
      return { type: 'monthly', dayOfMonth: r.dayOfMonth };
    }
  }
  return undefined;
}
