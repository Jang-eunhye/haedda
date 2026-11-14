/** 스티커 기록 한 줄: 할일 완료(스티커 +) 또는 보상 받기(스티커 −) */
export type HistoryEntryType = 'todo' | 'reward';

export interface HistoryEntry {
  id: string;
  type: HistoryEntryType;
  /** 그때의 할일·보상 이름 (나중에 수정·삭제돼도 기록은 남는다) */
  content: string;
  /** 받은 스티커는 양수, 쓴 스티커는 음수. 기한이 지나 받지 못한 완료는 0 */
  stickers: number;
  /** 기록된 시각 (ISO) */
  at: string;
  categoryId?: string;
}
