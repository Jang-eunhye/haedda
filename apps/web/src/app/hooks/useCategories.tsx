'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createDefaultCategories, TodoCategory } from '../utils/categories';
import { CATEGORIES_STORAGE_KEY } from '@haedda/constants';
import {
  type CategoryInput,
  createCategory,
  deleteCategoryFromList,
  parseCategoriesFromUnknown,
  updateCategoryInList,
} from '@haedda/domain';

export type { CategoryInput };

interface CategoriesContextValue {
  categories: TodoCategory[];
  addCategory: (data: CategoryInput) => TodoCategory | null;
  updateCategory: (id: string, data: CategoryInput) => boolean;
  deleteCategory: (id: string) => boolean;
  reorderCategories: (next: TodoCategory[]) => void;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

function loadCategoriesFromStorage(): TodoCategory[] {
  const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (stored === null) {
    return createDefaultCategories();
  }
  try {
    return parseCategoriesFromUnknown(JSON.parse(stored));
  } catch {
    return [];
  }
}

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<TodoCategory[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCategories(loadCategoriesFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories, ready]);

  const addCategory = useCallback((data: CategoryInput): TodoCategory | null => {
    const category = createCategory(data);
    if (!category) return null;
    setCategories(prev => [...prev, category]);
    return category;
  }, []);

  const updateCategory = useCallback((id: string, data: CategoryInput): boolean => {
    let updated = false;
    setCategories(prev => {
      const outcome = updateCategoryInList(prev, id, data);
      updated = outcome.updated;
      return outcome.categories;
    });
    return updated;
  }, []);

  const deleteCategory = useCallback((id: string): boolean => {
    let removed = false;
    setCategories(prev => {
      const outcome = deleteCategoryFromList(prev, id);
      removed = outcome.removed;
      return outcome.categories;
    });
    return removed;
  }, []);

  const reorderCategories = useCallback((next: TodoCategory[]) => {
    setCategories(next);
  }, []);

  const value = useMemo(
    () => ({
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
    }),
    [categories, addCategory, updateCategory, deleteCategory, reorderCategories]
  );

  return (
    <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories must be used within CategoriesProvider');
  }
  return ctx;
}
