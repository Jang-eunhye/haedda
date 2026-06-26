export type CategoryColor =
  | 'red'
  | 'orange'
  | 'lime'
  | 'yellow'
  | 'indigo'
  | 'teal'
  | 'cyan'
  | 'blue'
  | 'violet'
  | 'pink';

export interface TodoCategory {
  id: string;
  label: string;
  color: CategoryColor;
}

export function createDefaultCategories(): TodoCategory[] {
  return [
    { id: crypto.randomUUID(), label: '업무', color: 'red' },
    { id: crypto.randomUUID(), label: '일정', color: 'blue' },
    { id: crypto.randomUUID(), label: '일상', color: 'yellow' },
  ];
}

export const CATEGORY_COLORS: CategoryColor[] = [
  'red',
  'orange',
  'yellow',
  'lime',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'pink',
];

/** 스크린 리더용 (UI에는 동그라미만 표시) */
export const CATEGORY_COLOR_LABELS: Record<CategoryColor, string> = {
  red: '빨강',
  orange: '주황',
  lime: '연두',
  yellow: '노랑',
  indigo: '남색',
  teal: '청록',
  cyan: '하늘',
  blue: '파랑',
  violet: '보라',
  pink: '분홍',
};

export const CATEGORY_COLOR_CLASS: Record<CategoryColor, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  lime: 'bg-lime-500',
  yellow: 'bg-yellow-400',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  pink: 'bg-pink-500',
};

export const CATEGORY_STRIPE_CLASS = CATEGORY_COLOR_CLASS;

export const CATEGORY_CHIP_CLASS: Record<
  CategoryColor,
  { selected: string; unselected: string }
> = {
  red: {
    selected: 'bg-red-500 text-white border-red-500',
    unselected:
      'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800',
  },
  orange: {
    selected: 'bg-orange-500 text-white border-orange-500',
    unselected:
      'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:text-orange-800',
  },
  lime: {
    selected: 'bg-lime-500 text-white border-lime-500',
    unselected:
      'bg-lime-50 text-lime-800 border-lime-200 hover:bg-lime-100 hover:text-lime-900',
  },
  yellow: {
    selected: 'bg-yellow-400 text-yellow-950 border-yellow-400',
    unselected:
      'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-900',
  },
  indigo: {
    selected: 'bg-indigo-500 text-white border-indigo-500',
    unselected:
      'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800',
  },
  teal: {
    selected: 'bg-teal-500 text-white border-teal-500',
    unselected:
      'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 hover:text-teal-800',
  },
  cyan: {
    selected: 'bg-cyan-500 text-white border-cyan-500',
    unselected:
      'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 hover:text-cyan-800',
  },
  blue: {
    selected: 'bg-blue-500 text-white border-blue-500',
    unselected:
      'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800',
  },
  violet: {
    selected: 'bg-violet-500 text-white border-violet-500',
    unselected:
      'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:text-violet-800',
  },
  pink: {
    selected: 'bg-pink-500 text-white border-pink-500',
    unselected:
      'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 hover:text-pink-800',
  },
};

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
