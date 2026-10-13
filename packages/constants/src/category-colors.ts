import type { CategoryColor } from '@haedda/types';

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

export const CATEGORY_LABEL_MAX_LENGTH = 10;
