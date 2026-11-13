import { REWARDS_STORAGE_KEY } from '@haedda/constants';
import type { Reward } from '@haedda/types';
import { parseRewardsFromUnknown } from '@haedda/domain';
import type { StorageAdapter } from '../types';

function parseRewards(raw: string | null): Reward[] {
  if (!raw) return [];
  try {
    return parseRewardsFromUnknown(JSON.parse(raw));
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
