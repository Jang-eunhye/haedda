import { HISTORY_STORAGE_KEY } from '@haedda/constants';
import { parseHistoryFromUnknown } from '@haedda/domain';
import type { HistoryEntry } from '@haedda/types';
import type { StorageAdapter } from '../types';

function parseHistory(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    return parseHistoryFromUnknown(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function createHistoryRepository(storage: StorageAdapter) {
  return {
    async loadHistory(): Promise<HistoryEntry[]> {
      return parseHistory(await storage.getItem(HISTORY_STORAGE_KEY));
    },

    async saveHistory(history: HistoryEntry[]): Promise<void> {
      await storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    },
  };
}

export type HistoryRepository = ReturnType<typeof createHistoryRepository>;
