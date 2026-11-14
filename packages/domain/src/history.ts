import type { HistoryEntry, HistoryEntryType } from '@haedda/types';
import { HISTORY_MAX_ENTRIES } from '@haedda/constants';
import { formatDateISO, generateId } from '@haedda/utils';

export function createHistoryEntry(
  data: { type: HistoryEntryType; content: string; stickers: number; categoryId?: string },
  now: Date = new Date(),
  id: string = generateId()
): HistoryEntry {
  const entry: HistoryEntry = {
    id,
    type: data.type,
    content: data.content,
    stickers: data.stickers,
    at: now.toISOString(),
  };
  if (data.categoryId) entry.categoryId = data.categoryId;
  return entry;
}

/** 새 기록을 맨 앞에 넣고, 최대 개수를 넘으면 오래된 것부터 버린다 */
export function prependHistory(
  history: HistoryEntry[],
  entry: HistoryEntry,
  max: number = HISTORY_MAX_ENTRIES
): HistoryEntry[] {
  return [entry, ...history].slice(0, max);
}

/** 저장소에서 읽은 값 중 올바른 기록만 남기고 최신순으로 정렬한다 */
export function parseHistoryFromUnknown(parsed: unknown): HistoryEntry[] {
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (item): item is HistoryEntry =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as HistoryEntry).id === 'string' &&
        ((item as HistoryEntry).type === 'todo' || (item as HistoryEntry).type === 'reward') &&
        typeof (item as HistoryEntry).content === 'string' &&
        typeof (item as HistoryEntry).stickers === 'number' &&
        typeof (item as HistoryEntry).at === 'string' &&
        !Number.isNaN(Date.parse((item as HistoryEntry).at))
    )
    .sort((a, b) => b.at.localeCompare(a.at));
}

/** 기록이 남은 로컬 날짜 (YYYY-MM-DD) */
export function historyEntryDay(entry: HistoryEntry): string {
  return formatDateISO(new Date(entry.at));
}

export interface HistorySummary {
  /** 완료한 할일 수 */
  completed: number;
  /** 받은 스티커 */
  earned: number;
  /** 보상으로 쓴 스티커 (양수) */
  spent: number;
}

/** start~end(포함, YYYY-MM-DD) 사이의 기록을 합산한다 */
export function summarizeHistory(history: HistoryEntry[], start: string, end: string): HistorySummary {
  const summary: HistorySummary = { completed: 0, earned: 0, spent: 0 };
  for (const entry of history) {
    const day = historyEntryDay(entry);
    if (day < start || day > end) continue;
    if (entry.type === 'todo') {
      summary.completed += 1;
      summary.earned += Math.max(0, entry.stickers);
    } else {
      summary.spent += Math.abs(entry.stickers);
    }
  }
  return summary;
}

export interface HistoryDayGroup {
  day: string;
  entries: HistoryEntry[];
}

/** 최신순 기록을 날짜별로 묶는다 (날짜도 최신순) */
export function groupHistoryByDay(history: HistoryEntry[]): HistoryDayGroup[] {
  const groups: HistoryDayGroup[] = [];
  for (const entry of history) {
    const day = historyEntryDay(entry);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.entries.push(entry);
    else groups.push({ day, entries: [entry] });
  }
  return groups;
}

/** 날짜 묶음 제목: 오늘 / 어제 / 11월 12일 */
export function formatHistoryDayLabel(day: string, now: Date = new Date()): string {
  const today = formatDateISO(now);
  const yesterday = formatDateISO(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  if (day === today) return '오늘';
  if (day === yesterday) return '어제';
  const [y, m, d] = day.split('-').map(Number);
  return y === now.getFullYear() ? `${m}월 ${d}일` : `${y}년 ${m}월 ${d}일`;
}

/** 기록 시각: 오전 9:05 / 오후 3:20 */
export function formatHistoryTime(entry: HistoryEntry): string {
  const date = new Date(entry.at);
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const period = h < 12 ? '오전' : '오후';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${period} ${hour12}:${m}`;
}
