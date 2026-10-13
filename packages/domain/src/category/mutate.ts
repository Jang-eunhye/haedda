import type { CategoryColor, TodoCategory } from '@haedda/types';
import { CATEGORY_LABEL_MAX_LENGTH } from '@haedda/constants';
import { generateId, normalizeCategoryColor } from '@haedda/utils';

export interface CategoryInput {
  label: string;
  color: CategoryColor;
}

export function normalizeCategoryLabel(label: string): string {
  return label.trim().slice(0, CATEGORY_LABEL_MAX_LENGTH);
}

export function normalizeCategory(raw: unknown): TodoCategory | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Record<string, unknown>;
  if (typeof c.id !== 'string' || typeof c.label !== 'string') return null;
  const color = normalizeCategoryColor(c.color);
  if (!color) return null;
  const label = normalizeCategoryLabel(c.label);
  if (!label) return null;
  return { id: c.id, label, color };
}

export function parseCategoriesFromUnknown(parsed: unknown): TodoCategory[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.map(normalizeCategory).filter((x): x is TodoCategory => x !== null);
}

export function createCategory(
  data: CategoryInput,
  id: string = generateId()
): TodoCategory | null {
  const label = normalizeCategoryLabel(data.label);
  if (!label) return null;
  return { id, label, color: data.color };
}

export function updateCategoryInList(
  categories: TodoCategory[],
  id: string,
  data: CategoryInput
): { categories: TodoCategory[]; updated: boolean } {
  const label = normalizeCategoryLabel(data.label);
  if (!label) return { categories, updated: false };
  return {
    categories: categories.map(c =>
      c.id === id ? { ...c, label, color: data.color } : c
    ),
    updated: true,
  };
}

export function deleteCategoryFromList(
  categories: TodoCategory[],
  id: string
): { categories: TodoCategory[]; removed: boolean } {
  const next = categories.filter(c => c.id !== id);
  return { categories: next, removed: next.length !== categories.length };
}
