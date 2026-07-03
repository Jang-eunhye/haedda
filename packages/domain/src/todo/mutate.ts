import type { Todo, TodoInput } from '@haedda/types';

export function createTodo(data: TodoInput, id: string = crypto.randomUUID()): Todo {
  const { memo, deadline, categoryId, ...rest } = data;
  return {
    ...rest,
    id,
    ...(deadline ? { deadline } : {}),
    ...(memo ? { memo } : {}),
    ...(categoryId ? { categoryId } : {}),
  };
}

export function updateTodoInList(todos: Todo[], id: string, data: TodoInput): Todo[] {
  return todos.map(t => {
    if (t.id !== id) return t;
    const next = { ...t, ...data };
    if (!data.memo) delete next.memo;
    if (!data.deadline) delete next.deadline;
    if (!data.categoryId) delete next.categoryId;
    return next;
  });
}

export function deleteTodoFromList(todos: Todo[], id: string): Todo[] {
  return todos.filter(t => t.id !== id);
}

export function clearCategoryFromTodos(todos: Todo[], categoryId: string): Todo[] {
  return todos.map(t => {
    if (t.categoryId !== categoryId) return t;
    const next = { ...t };
    delete next.categoryId;
    return next;
  });
}
