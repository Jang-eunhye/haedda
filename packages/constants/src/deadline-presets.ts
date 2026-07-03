export type DeadlinePreset = 'today' | 'tomorrow' | 'week' | 'month' | 'later';

export const DEADLINE_PRESET_OPTIONS = [
  { value: 'today' as const, label: '오늘' },
  { value: 'tomorrow' as const, label: '내일' },
  { value: 'week' as const, label: '이번 주' },
  { value: 'month' as const, label: '이번 달' },
  { value: 'later' as const, label: '나중에' },
];
