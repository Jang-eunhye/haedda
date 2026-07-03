import { CATEGORIES_STORAGE_KEY } from '@haedda/constants';
import type { TodoCategory } from '@haedda/types';
import { parseCategoriesFromUnknown } from '@haedda/domain';
import { createDefaultCategories } from '@haedda/utils';
import type { StorageAdapter } from '../types';

export function createCategoryRepository(storage: StorageAdapter) {
  return {
    async loadCategories(): Promise<TodoCategory[]> {
      const stored = await storage.getItem(CATEGORIES_STORAGE_KEY);
      if (stored === null) {
        return createDefaultCategories();
      }
      try {
        return parseCategoriesFromUnknown(JSON.parse(stored));
      } catch {
        return [];
      }
    },

    async saveCategories(categories: TodoCategory[]): Promise<void> {
      await storage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    },
  };
}

export type CategoryRepository = ReturnType<typeof createCategoryRepository>;
