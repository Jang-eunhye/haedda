import type { CategoryColor } from '@haedda/types';

/** 웹 globals.css의 색상 토큰과 같은 값 */
export const colors = {
  background: '#f4f4f5',
  foreground: '#18181b',
  surface: '#ffffff',
  muted: '#71717a',
  mutedSoft: 'rgba(113, 113, 122, 0.6)',
  border: '#e4e4e7',
  borderSoft: 'rgba(228, 228, 231, 0.5)',
  accent: '#f59e0b',
  accentSoft: '#fffbeb',
  accentMuted: '#fef3c7',
  success: '#22c55e',
  successSoft: '#f0fdf4',
  successBorder: 'rgba(34, 197, 94, 0.2)',
  danger: '#ef4444',
  dangerSoft: '#fef2f2',
  dangerBorder: 'rgba(239, 68, 68, 0.2)',
  white: '#ffffff',
  backdrop: 'rgba(0, 0, 0, 0.3)',
} as const;

export const CATEGORY_COLOR: Record<CategoryColor, string> = {
  red: '#ef4444',
  orange: '#f97316',
  lime: '#84cc16',
  yellow: '#facc15',
  indigo: '#6366f1',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  pink: '#ec4899',
};

interface ChipColors {
  background: string;
  text: string;
  border: string;
}

export const CATEGORY_CHIP: Record<
  CategoryColor,
  { selected: ChipColors; unselected: ChipColors }
> = {
  red: {
    selected: { background: '#ef4444', text: '#ffffff', border: '#ef4444' },
    unselected: { background: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  },
  orange: {
    selected: { background: '#f97316', text: '#ffffff', border: '#f97316' },
    unselected: { background: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  },
  lime: {
    selected: { background: '#84cc16', text: '#ffffff', border: '#84cc16' },
    unselected: { background: '#f7fee7', text: '#3f6212', border: '#d9f99d' },
  },
  yellow: {
    selected: { background: '#facc15', text: '#422006', border: '#facc15' },
    unselected: { background: '#fefce8', text: '#854d0e', border: '#fef08a' },
  },
  indigo: {
    selected: { background: '#6366f1', text: '#ffffff', border: '#6366f1' },
    unselected: { background: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  },
  teal: {
    selected: { background: '#14b8a6', text: '#ffffff', border: '#14b8a6' },
    unselected: { background: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  },
  cyan: {
    selected: { background: '#06b6d4', text: '#ffffff', border: '#06b6d4' },
    unselected: { background: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  },
  blue: {
    selected: { background: '#3b82f6', text: '#ffffff', border: '#3b82f6' },
    unselected: { background: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  },
  violet: {
    selected: { background: '#8b5cf6', text: '#ffffff', border: '#8b5cf6' },
    unselected: { background: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  },
  pink: {
    selected: { background: '#ec4899', text: '#ffffff', border: '#ec4899' },
    unselected: { background: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
  },
};
