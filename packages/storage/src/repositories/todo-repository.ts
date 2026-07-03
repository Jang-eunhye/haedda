import {
  LEGACY_MISSIONS_STORAGE_KEY,
  TODOS_STORAGE_KEY,
} from '@haedda/constants';
import type { Todo } from '@haedda/types';
import { mergeRecurringRefreshIntoStored, parseTodosFromUnknown } from '@haedda/domain';
import type { StorageAdapter } from '../types';

export function createTodoRepository(storage: StorageAdapter) {
  return {
    async loadTodos(): Promise<Todo[]> {
      try {
        const stored = await storage.getItem(TODOS_STORAGE_KEY);
        if (stored) {
          return parseTodosFromUnknown(JSON.parse(stored));
        }

        const legacy = await storage.getItem(LEGACY_MISSIONS_STORAGE_KEY);
        if (legacy) {
          const todos = parseTodosFromUnknown(JSON.parse(legacy));
          await storage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
          await storage.removeItem(LEGACY_MISSIONS_STORAGE_KEY);
          return todos;
        }
      } catch {}
      return [];
    },

    async saveTodos(todos: Todo[]): Promise<void> {
      await storage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    },

    async persistRecurringRefresh(refreshedTodos: Todo[]): Promise<void> {
      try {
        const raw = await storage.getItem(TODOS_STORAGE_KEY);
        if (!raw) return;

        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;

        const { merged, changed } = mergeRecurringRefreshIntoStored(parsed, refreshedTodos);
        if (changed) {
          await storage.setItem(TODOS_STORAGE_KEY, JSON.stringify(merged));
        }
      } catch {}
    },
  };
}

export type TodoRepository = ReturnType<typeof createTodoRepository>;
