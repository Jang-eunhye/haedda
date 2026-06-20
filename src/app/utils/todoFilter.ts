import { Todo } from '../types';
import {
  getTodayISO,
  getWeekRangeISO,
  isDeadlineExpired,
  isDeadlineInRange,
  isDeadlineThisMonth,
  isDeadlineToday,
} from './date';

export type TodoFilter = 'all' | 'today' | 'week' | 'month' | 'sticker';

/** 일회성: 기한 지남 / 반복: 미완료 주기 누적 */
export function isMissedTodo(todo: Todo): boolean {
  if (todo.recurrence) return (todo.missedCount ?? 0) > 0;
  return isDeadlineExpired(todo.deadline);
}

export function countMissedTodos(todos: Todo[]): number {
  return todos.filter(isMissedTodo).length;
}

export function matchesTodoFilter(todo: Todo, filter: TodoFilter, ref: Date = new Date()): boolean {
  if (filter === 'all') return true;
  if (filter === 'sticker') return todo.stickerCount > 0;
  if (filter === 'today') return isDeadlineToday(todo.deadline);
  if (filter === 'week') {
    const { start, end } = getWeekRangeISO(ref);
    return isDeadlineInRange(todo.deadline, start, end);
  }
  if (filter === 'month') return isDeadlineThisMonth(todo.deadline, ref);
  return true;
}

/** 필터 기준일 (테스트·일관성용) */
export function getFilterContext(ref: Date = new Date()) {
  return {
    today: getTodayISO(),
    week: getWeekRangeISO(ref),
  };
}
