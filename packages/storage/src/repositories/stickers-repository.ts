import { STICKERS_STORAGE_KEY } from '@haedda/constants';
import type { StorageAdapter } from '../types';

function parseStickers(raw: string | null): number {
  if (!raw) return 0;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'number' ? parsed : 0;
  } catch {
    return 0;
  }
}

export function createStickersRepository(storage: StorageAdapter) {
  return {
    async loadTotalStickers(): Promise<number> {
      const raw = await storage.getItem(STICKERS_STORAGE_KEY);
      return parseStickers(raw);
    },

    async saveTotalStickers(total: number): Promise<void> {
      await storage.setItem(STICKERS_STORAGE_KEY, JSON.stringify(total));
    },
  };
}

export type StickersRepository = ReturnType<typeof createStickersRepository>;
