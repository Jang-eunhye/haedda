import type { Reward } from '@haedda/types';
import { generateId } from '@haedda/utils';

/** 저장소나 백업에서 읽은 값 중 올바른 보상만 남긴다 */
export function parseRewardsFromUnknown(parsed: unknown): Reward[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (item): item is Reward =>
      !!item &&
      typeof item === 'object' &&
      typeof (item as Reward).id === 'string' &&
      typeof (item as Reward).content === 'string' &&
      typeof (item as Reward).stickerCost === 'number'
  );
}

export function createReward(data: Omit<Reward, 'id'>, id: string = generateId()): Reward {
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
