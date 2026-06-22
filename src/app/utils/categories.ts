export type CategoryColor = 'red' | 'amber' | 'emerald';

export interface TodoCategory {
  id: string;
  label: string;
  color: CategoryColor;
}

/** 관리 페이지 연동 전까지 모달·표시에 사용하는 기본 카테고리 */
export const DEFAULT_CATEGORIES: TodoCategory[] = [
  { id: 'work', label: '업무', color: 'red' },
  { id: 'life', label: '생활', color: 'amber' },
  { id: 'health', label: '건강', color: 'emerald' },
];

export const CATEGORY_CHIP_CLASS: Record<
  CategoryColor,
  { selected: string; unselected: string }
> = {
  red: {
    selected: 'bg-red-500 text-white border-red-500',
    unselected:
      'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800',
  },
  amber: {
    selected: 'bg-accent text-white border-accent',
    unselected:
      'bg-accent-soft text-accent border-amber-200 hover:bg-accent-muted/40',
  },
  emerald: {
    selected: 'bg-emerald-500 text-white border-emerald-500',
    unselected:
      'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800',
  },
};

export function getCategoryById(id: string): TodoCategory | undefined {
  return DEFAULT_CATEGORIES.find(c => c.id === id);
}
