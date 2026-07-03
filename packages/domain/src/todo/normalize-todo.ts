import type { Todo } from '@haedda/types';
import { normalizeDeadline, refreshRecurringTodo } from '@haedda/utils';
import { normalizeRecurrence } from './normalize-recurrence';

export function normalizeTodo(raw: unknown): Todo | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  if (typeof m.id !== 'string' || typeof m.content !== 'string') return null;
  if (typeof m.stickerCount !== 'number') return null;
  if (m.completed === true) return null;

  const deadline =
    typeof m.deadline === 'string' ? normalizeDeadline(m.deadline) : undefined;
  const recurrence = normalizeRecurrence(m.recurrence);
  const memo = typeof m.memo === 'string' ? m.memo.trim() : undefined;
  const categoryId = typeof m.categoryId === 'string' ? m.categoryId : undefined;
  const todo: Todo = {
    id: m.id,
    content: m.content,
    stickerCount: m.stickerCount,
    ...(deadline ? { deadline } : {}),
    ...(memo ? { memo } : {}),
    ...(categoryId ? { categoryId } : {}),
    recurrence,
    missedCount: typeof m.missedCount === 'number' ? m.missedCount : 0,
    consecutiveCompletions:
      typeof m.consecutiveCompletions === 'number' ? m.consecutiveCompletions : 0,
  };

  if (recurrence) {
    return refreshRecurringTodo(todo);
  }

  return todo;
}

export function parseTodosFromUnknown(parsed: unknown): Todo[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.map(normalizeTodo).filter((x): x is Todo => x !== null);
}
