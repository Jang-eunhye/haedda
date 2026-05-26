export interface Mission {
  id: string;
  content: string;
  deadline: string; // "YYYY-MM-DDTHH:mm"
  stickerCount: number;
  completed: boolean;
}

export type TabType = 'mission' | 'reward';
