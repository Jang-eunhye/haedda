export interface Mission {
  id: string;
  content: string;
  deadline: string; // "YYYY-MM-DD"
  stickerCount: number;
}

export interface Reward {
  id: string;
  content: string;
  stickerCost: number;
}

export type TabType = 'mission' | 'reward';

export type MissionInput = Omit<Mission, 'id'>;
