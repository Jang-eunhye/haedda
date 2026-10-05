import type { CategoryColor, TodoCategory } from '@haedda/types';
import { CATEGORY_COLORS } from '@haedda/constants';
import { generateId } from './id';

export function createDefaultCategories(): TodoCategory[] {
  return [
    { id: generateId(), label: '업무', color: 'red' },
    { id: generateId(), label: '일정', color: 'blue' },
    { id: generateId(), label: '일상', color: 'yellow' },
  ];
}

export function normalizeCategoryColor(raw: unknown): CategoryColor | null {
  if (raw === 'emerald' || raw === 'green') return 'teal';
  if (raw === 'amber') return 'yellow';
  if (typeof raw === 'string' && (CATEGORY_COLORS as string[]).includes(raw)) {
    return raw as CategoryColor;
  }
  return null;
}

export function getCategoryById(
  categories: TodoCategory[],
  id: string
): TodoCategory | undefined {
  return categories.find(c => c.id === id);
}
