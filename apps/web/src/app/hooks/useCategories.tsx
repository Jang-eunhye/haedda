'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CategoryColor,
  createDefaultCategories,
  TodoCategory,
  normalizeCategoryColor,
} from '../utils/categories';
import {
  CATEGORIES_STORAGE_KEY,
  CATEGORY_LABEL_MAX_LENGTH,
} from '@haedda/constants';

export interface CategoryInput {
  label: string;
  color: CategoryColor;
}

interface CategoriesContextValue {
  categories: TodoCategory[];
  addCategory: (data: CategoryInput) => TodoCategory | null;
  updateCategory: (id: string, data: CategoryInput) => boolean;
  deleteCategory: (id: string) => boolean;
  reorderCategories: (next: TodoCategory[]) => void;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

function normalizeCategory(raw: unknown): TodoCategory | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Record<string, unknown>;
  if (typeof c.id !== 'string' || typeof c.label !== 'string') return null;
  const color = normalizeCategoryColor(c.color);
  if (!color) return null;
  const label = c.label.trim();
  if (!label) return null;
  return { id: c.id, label: label.slice(0, CATEGORY_LABEL_MAX_LENGTH), color };
}

function loadCategoriesFromStorage(): TodoCategory[] {
  const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (stored === null) {
    return createDefaultCategories();
  }
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeCategory)
      .filter((x): x is TodoCategory => x !== null);
  } catch {
    return [];
  }
}

function normalizeLabel(label: string): string {
  return label.trim().slice(0, CATEGORY_LABEL_MAX_LENGTH);
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
    const label = normalizeLabel(data.label);
    if (!label) return null;
    const category: TodoCategory = {
      id: crypto.randomUUID(),
      label,
      color: data.color,
    };
    setCategories(prev => [...prev, category]);
    return category;
  }, []);

  const updateCategory = useCallback((id: string, data: CategoryInput): boolean => {
    const label = normalizeLabel(data.label);
    if (!label) return false;
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, label, color: data.color } : c))
    );
    return true;
  }, []);

  const deleteCategory = useCallback((id: string): boolean => {
    let removed = false;
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      removed = next.length !== prev.length;
      return next;
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
