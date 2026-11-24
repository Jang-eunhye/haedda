import type { HistoryEntry, Todo } from '@haedda/types';
import { formatDateISO, getDaysInMonth, normalizeDeadline } from '@haedda/utils';
import { historyEntryDay } from './history';

export interface CalendarCell {
  /** YYYY-MM-DD */
  day: string;
  /** 1~31 */
  date: number;
  /** 0=일 ... 6=토 */
  weekday: number;
}

/**
 * 한 달 달력 칸. 일요일 시작 7칸 기준으로, 1일 앞의 빈 칸은 null이다.
 * month는 1~12.
 */
export function buildMonthGrid(year: number, month: number): (CalendarCell | null)[] {
  const first = new Date(year, month - 1, 1);
  const cells: (CalendarCell | null)[] = Array.from({ length: first.getDay() }, () => null);
  const days = getDaysInMonth(year, month);
  for (let date = 1; date <= days; date++) {
    const d = new Date(year, month - 1, date);
    cells.push({ day: formatDateISO(d), date, weekday: d.getDay() });
  }
  return cells;
}

/** 기한이 있는 할일을 기한 날짜별로 묶는다 */
export function groupTodosByDeadline(todos: Todo[]): Map<string, Todo[]> {
  const map = new Map<string, Todo[]>();
  for (const todo of todos) {
    if (!todo.deadline) continue;
    const day = normalizeDeadline(todo.deadline);
    const list = map.get(day);
    if (list) list.push(todo);
    else map.set(day, [todo]);
  }
  return map;
}

/** 할일 완료 기록을 날짜별로 묶는다 (보상 기록은 빼고, 시간순) */
export function groupCompletionsByDay(history: HistoryEntry[]): Map<string, HistoryEntry[]> {
  const map = new Map<string, HistoryEntry[]>();
  for (const entry of history) {
    if (entry.type !== 'todo') continue;
    const day = historyEntryDay(entry);
    const list = map.get(day);
    if (list) list.unshift(entry);
    else map.set(day, [entry]);
  }
  return map;
}

/** 달 이동: delta만큼 앞뒤 달의 { year, month } */
export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/** 고른 날 제목: 14일 토요일 */
export function formatCalendarDayTitle(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  return `${d}일 ${WEEKDAY_LABELS[weekday]}요일`;
}
