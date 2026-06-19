export type RecurrenceType = 'daily' | 'weekly' | 'monthly';

export interface MissionRecurrence {
  type: RecurrenceType;
  /** 0=일, 1=월, ... 6=토 */
  weekdays?: number[];
  /** 1~31 또는 'last'(매월 말일) */
  dayOfMonth?: number | 'last';
}

export interface Mission {
  id: string;
  content: string;
  deadline: string; // "YYYY-MM-DD"
  stickerCount: number;
  recurrence?: MissionRecurrence; // 없으면 일회성
}

export interface Reward {
  id: string;
  content: string;
  stickerCost: number;
}

export type TabType = 'mission' | 'reward';

export type MissionInput = Omit<Mission, 'id'>;

export interface MissionCompleteResult {
  earned: number;
  content: string;
  isRecurring: boolean;
  nextDeadline?: string;
}
