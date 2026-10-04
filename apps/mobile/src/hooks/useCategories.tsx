import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoCategory } from '@haedda/types';
import {
  type CategoryInput,
  createCategory,
  deleteCategoryFromList,
  updateCategoryInList,
} from '@haedda/domain';
import { appStorage } from '@/src/storage';

export type { CategoryInput };

interface CategoriesContextValue {
  categories: TodoCategory[];
  addCategory: (data: CategoryInput) => TodoCategory | null;
  updateCategory: (id: string, data: CategoryInput) => boolean;
  deleteCategory: (id: string) => boolean;
  reorderCategories: (next: TodoCategory[]) => void;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<TodoCategory[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const loaded = await appStorage.categories.loadCategories();
      if (!cancelled) {
        setCategories(loaded);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void appStorage.categories.saveCategories(categories);
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
