export interface Mission {
  id: string;
  content: string;
  deadline: string; // "YYYY-MM-DD"
  stickerCount: number;
  completed: boolean;
  earnedStickers?: number; // 완료 시 실제 획득한 스티커 수
}

export interface Reward {
  id: string;
  content: string;
  stickerCost: number;
}

export type TabType = 'mission' | 'reward';
