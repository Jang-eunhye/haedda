'use client';

import { useMemo, useState } from 'react';
import { Reward } from '../types';
import RewardCard from './RewardCard';
import RewardFormModal from './RewardFormModal';
import ClaimRewardModal from './ClaimRewardModal';
import EmptyState from './EmptyState';
import Fab from './Fab';
import SortSelect from './SortSelect';

const APP_TAGLINE = '미션을 완료하고 스티커를 모아보세요';

type RewardSort = 'registered' | 'sticker-asc' | 'sticker-desc';

const REWARD_SORT_OPTIONS = [
  { value: 'registered' as const, label: '등록순' },
  { value: 'sticker-asc' as const, label: '스티커 적은 순' },
  { value: 'sticker-desc' as const, label: '스티커 많은 순' },
];

interface Props {
  rewards: Reward[];
  totalStickers: number;
  onAddReward: (reward: Omit<Reward, 'id'>) => void;
  onUpdateReward: (id: string, data: Omit<Reward, 'id'>) => void;
  onDeleteReward: (id: string) => void;
  onClaimReward: (id: string) => boolean;
}

export default function RewardTab({
  rewards,
  totalStickers,
  onAddReward,
  onUpdateReward,
  onDeleteReward,
  onClaimReward,
}: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Reward | null>(null);
  const [claimTarget, setClaimTarget] = useState<Reward | null>(null);
  const [sort, setSort] = useState<RewardSort>('registered');

  const sortedRewards = useMemo(() => {
    if (sort === 'registered') return rewards;
    if (sort === 'sticker-asc') {
      return [...rewards].sort((a, b) => a.stickerCost - b.stickerCost);
    }
    return [...rewards].sort((a, b) => b.stickerCost - a.stickerCost);
  }, [rewards, sort]);

  const handleClaimConfirm = () => {
    if (!claimTarget) return;
    const success = onClaimReward(claimTarget.id);
    if (success) setClaimTarget(null);
  };

  return (
    <div className="pb-20">
      {rewards.length === 0 ? (
        <EmptyState
          icon="🎁"
          tagline={APP_TAGLINE}
          title="아직 보상이 없어요"
          description="받고 싶은 보상을 추가하고 스티커로 교환해 보세요"
        />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              보상
              <span className="text-sm font-semibold text-muted tabular-nums">({rewards.length})</span>
            </h2>
            <SortSelect
              value={sort}
              onChange={setSort}
              options={REWARD_SORT_OPTIONS}
              ariaLabel="보상 정렬"
            />
          </div>
          <div className="space-y-3">
            {sortedRewards.map(reward => (
              <RewardCard
                key={reward.id}
                reward={reward}
                totalStickers={totalStickers}
                onClaim={id => {
                  const target = rewards.find(r => r.id === id);
                  if (target) setClaimTarget(target);
                }}
                onEdit={setEditTarget}
                onDelete={onDeleteReward}
              />
            ))}
          </div>
        </>
      )}

      {isAddOpen && (
        <RewardFormModal
          onClose={() => setIsAddOpen(false)}
          onSave={data => {
            onAddReward(data);
            setIsAddOpen(false);
          }}
        />
      )}

      {editTarget && (
        <RewardFormModal
          reward={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={data => {
            onUpdateReward(editTarget.id, data);
            setEditTarget(null);
          }}
        />
      )}

      {claimTarget && (
        <ClaimRewardModal
          reward={claimTarget}
          totalStickers={totalStickers}
          onClose={() => setClaimTarget(null)}
          onConfirm={handleClaimConfirm}
        />
      )}

      <Fab onClick={() => setIsAddOpen(true)} label="보상 추가" />
    </div>
  );
}
