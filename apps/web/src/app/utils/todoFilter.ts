import { Todo } from '../types';
import {
  getTodayISO,
  getWeekRangeISO,
  isDeadlineExpired,
  isDeadlineInRange,
  isDeadlineThisMonth,
  isDeadlineToday,
} from './date';

export type TodoFilter = 'all' | 'today' | 'week' | 'month' | 'later' | 'sticker';

export interface TodoFilterOptions {
  /** 이번주 필터: 오늘 마감 제외 (기본 true) */
  excludeTodayFromWeek?: boolean;
  /** 이번달 필터: 이번주 마감 제외 (기본 true) */
  excludeWeekFromMonth?: boolean;
}

/** 일회성: 기한 지남 / 반복: 미완료 주기 누적 */
export function isMissedTodo(todo: Todo): boolean {
  if (todo.recurrence) return (todo.missedCount ?? 0) > 0;
  if (!todo.deadline) return false;
  return isDeadlineExpired(todo.deadline);
}

export function countMissedTodos(todos: Todo[]): number {
  return todos.filter(isMissedTodo).length;
}

/** 놓친 할일: 마감일 오래된 순 → 미완료 많은 순 */
export function sortMissedTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    const deadlineCompare = (a.deadline ?? '9999-12-31').localeCompare(
      b.deadline ?? '9999-12-31'
    );
    if (deadlineCompare !== 0) return deadlineCompare;
    const aMissed = a.recurrence ? (a.missedCount ?? 0) : 0;
    const bMissed = b.recurrence ? (b.missedCount ?? 0) : 0;
    return bMissed - aMissed;
  });
}

/** 기한 없음 (나중에) */
export function isLaterTodo(todo: Todo): boolean {
  return !todo.deadline;
}

export function matchesCategoryFilter(todo: Todo, categoryFilter: string): boolean {
  if (categoryFilter === 'all') return true;
  if (categoryFilter === 'uncategorized') return !todo.categoryId;
  return todo.categoryId === categoryFilter;
}

export function matchesTodoFilter(
  todo: Todo,
  filter: TodoFilter,
  options: TodoFilterOptions = {},
  ref: Date = new Date()
): boolean {
  if (filter === 'all') return true;
  if (filter === 'later') return isLaterTodo(todo);
  if (filter === 'sticker') return todo.stickerCount > 0;
  if (filter === 'today') return isDeadlineToday(todo.deadline);
  if (filter === 'week') {
    const { start, end } = getWeekRangeISO(ref);
    if (!isDeadlineInRange(todo.deadline, start, end)) return false;
    if (options.excludeTodayFromWeek !== false && isDeadlineToday(todo.deadline)) {
      return false;
    }
    return true;
  }
  if (filter === 'month') {
    if (!isDeadlineThisMonth(todo.deadline, ref)) return false;
    if (options.excludeWeekFromMonth !== false) {
      const { start, end } = getWeekRangeISO(ref);
      if (isDeadlineInRange(todo.deadline, start, end)) return false;
    }
    return true;
  }
  return true;
}

/** 필터 기준일 (테스트·일관성용) */
export function getFilterContext(ref: Date = new Date()) {
  return {
    today: getTodayISO(),
    week: getWeekRangeISO(ref),
  };
}
