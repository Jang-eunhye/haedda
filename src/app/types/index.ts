export type RecurrenceType = 'daily' | 'weekly' | 'monthly';

export interface TodoRecurrence {
  type: RecurrenceType;
  /** 0=일, 1=월, ... 6=토 */
  weekdays?: number[];
  /** 1~31 또는 'last'(매월 말일) */
  dayOfMonth?: number | 'last';
}

export interface Todo {
  id: string;
  content: string;
  deadline?: string; // 없으면 나중에(기한 없음)
  stickerCount: number;
  memo?: string;
  recurrence?: TodoRecurrence; // 없으면 일회성
  /** 반복 할일: 놓친 주기 수 */
  missedCount?: number;
  /** 반복 할일: 기한 내 연속 완료 수 */
  consecutiveCompletions?: number;
  /** 카테고리 id (선택) */
  categoryId?: string;
}

export interface Reward {
  id: string;
  content: string;
  stickerCost: number;
}

export type TabType = 'todo' | 'reward';

export type TodoInput = Omit<Todo, 'id'>;

export interface TodoCompleteResult {
  earned: number;
  stickerCount: number;
  content: string;
  isRecurring: boolean;
  nextDeadline?: string;
}
