import { REWARDS_STORAGE_KEY } from '@haedda/constants';
import type { Reward } from '@haedda/types';
import type { StorageAdapter } from '../types';

function parseRewards(raw: string | null): Reward[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Reward =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as Reward).id === 'string' &&
        typeof (item as Reward).content === 'string' &&
        typeof (item as Reward).stickerCost === 'number'
    );
  } catch {
    return [];
  }
}

export function createRewardRepository(storage: StorageAdapter) {
  return {
    async loadRewards(): Promise<Reward[]> {
      const raw = await storage.getItem(REWARDS_STORAGE_KEY);
      return parseRewards(raw);
    },

    async saveRewards(rewards: Reward[]): Promise<void> {
      await storage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewards));
    },
  };
}

export type RewardRepository = ReturnType<typeof createRewardRepository>;
