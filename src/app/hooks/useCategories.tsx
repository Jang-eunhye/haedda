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
  DEFAULT_CATEGORIES,
  TodoCategory,
  getCategoryById,
  normalizeCategoryColor,
} from '../utils/categories';

const CATEGORIES_KEY = 'haedda_categories';
const LABEL_MAX = 10;

export interface CategoryInput {
  label: string;
  color: CategoryColor;
}

interface CategoriesContextValue {
  categories: TodoCategory[];
  ready: boolean;
  addCategory: (data: CategoryInput) => TodoCategory | null;
  updateCategory: (id: string, data: CategoryInput) => boolean;
  deleteCategory: (id: string) => boolean;
  getById: (id: string) => TodoCategory | undefined;
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
  return { id: c.id, label: label.slice(0, LABEL_MAX), color };
}

function loadCategoriesFromStorage(): TodoCategory[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      const parsed: unknown[] = JSON.parse(stored);
      const categories = parsed
        .map(normalizeCategory)
        .filter((x): x is TodoCategory => x !== null);
      if (categories.length > 0) return categories;
    }
  } catch {}
  return DEFAULT_CATEGORIES;
}

function normalizeLabel(label: string): string {
  return label.trim().slice(0, LABEL_MAX);
}

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<TodoCategory[]>(DEFAULT_CATEGORIES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCategories(loadCategoriesFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories, ready]);

  const getById = useCallback(
    (id: string) => getCategoryById(categories, id),
    [categories]
  );

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

  const value = useMemo(
    () => ({
      categories,
      ready,
      addCategory,
      updateCategory,
      deleteCategory,
      getById,
    }),
    [categories, ready, addCategory, updateCategory, deleteCategory, getById]
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
