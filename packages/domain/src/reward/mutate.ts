import type { Reward } from '@haedda/types';

export function createReward(data: Omit<Reward, 'id'>, id: string = crypto.randomUUID()): Reward {
  return { ...data, id };
}

export function updateRewardInList(
  rewards: Reward[],
  id: string,
  data: Omit<Reward, 'id'>
): Reward[] {
  return rewards.map(r => (r.id === id ? { ...r, ...data } : r));
}

export function deleteRewardFromList(rewards: Reward[], id: string): Reward[] {
  return rewards.filter(r => r.id !== id);
}

export interface ClaimRewardOutcome {
  success: boolean;
  nextTotalStickers: number;
}

export function claimReward(
  rewards: Reward[],
  totalStickers: number,
  id: string
): ClaimRewardOutcome {
  const reward = rewards.find(r => r.id === id);
  if (!reward || totalStickers < reward.stickerCost) {
    return { success: false, nextTotalStickers: totalStickers };
  }
  return {
    success: true,
    nextTotalStickers: totalStickers - reward.stickerCost,
  };
}
