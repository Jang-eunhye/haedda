import type { Todo, TodoCompleteResult } from '@haedda/types';
import { computeNextDeadlineAfter, isDeadlineExpired } from '@haedda/utils';

export interface CompleteTodoOutcome {
  todos: Todo[];
  result: TodoCompleteResult | null;
  stickersEarned: number;
}

export function completeTodoInList(todos: Todo[], id: string): CompleteTodoOutcome {
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return { todos, result: null, stickersEarned: 0 };
  }

  const earned = isDeadlineExpired(todo.deadline) ? 0 : todo.stickerCount;

  if (todo.recurrence) {
    const onTime = !isDeadlineExpired(todo.deadline);
    const nextDeadline = computeNextDeadlineAfter(todo.recurrence, todo.deadline!);
    const result: TodoCompleteResult = {
      earned,
      stickerCount: todo.stickerCount,
      content: todo.content,
      isRecurring: true,
      nextDeadline,
    };
    const nextTodos = todos.map(t =>
      t.id === id
        ? {
            ...t,
            deadline: nextDeadline,
            missedCount: 0,
            consecutiveCompletions: onTime
              ? (todo.consecutiveCompletions ?? 0) + 1
              : 0,
          }
        : t
    );
    return { todos: nextTodos, result, stickersEarned: earned };
  }

  const result: TodoCompleteResult = {
    earned,
    stickerCount: todo.stickerCount,
    content: todo.content,
    isRecurring: false,
  };
  return {
    todos: todos.filter(t => t.id !== id),
    result,
    stickersEarned: earned,
  };
}
