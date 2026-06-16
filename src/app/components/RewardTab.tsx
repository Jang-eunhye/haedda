'use client';

import { useState } from 'react';
import { Reward } from '../types';
import RewardCard from './RewardCard';
import AddRewardModal from './AddRewardModal';
import ClaimRewardModal from './ClaimRewardModal';
import Fab from './Fab';

interface Props {
  rewards: Reward[];
  totalStickers: number;
  onAddReward: (reward: Omit<Reward, 'id'>) => void;
  onClaimReward: (id: string) => boolean;
}

export default function RewardTab({
  rewards,
  totalStickers,
  onAddReward,
  onClaimReward,
}: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<Reward | null>(null);

  const handleClaimConfirm = () => {
    if (!claimTarget) return;
    const success = onClaimReward(claimTarget.id);
    if (success) setClaimTarget(null);
  };

  return (
    <div className="pb-20">
      <div className="mb-5">
        <h2 className="text-base font-bold text-foreground">보상</h2>
        <p className="text-xs text-muted mt-0.5">
          등록된 보상 <span className="text-foreground font-semibold">{rewards.length}</span>개
        </p>
      </div>

      {rewards.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background flex items-center justify-center text-3xl">
            🎁
          </div>
          <p className="text-sm font-semibold text-foreground">아직 보상이 없어요</p>
          <p className="text-xs mt-1.5 text-muted max-w-[220px] mx-auto leading-relaxed">
            받고 싶은 보상을 추가하고 스티커로 교환해 보세요
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rewards.map(reward => (
            <RewardCard
              key={reward.id}
              reward={reward}
              totalStickers={totalStickers}
              onClaim={id => {
                const target = rewards.find(r => r.id === id);
                if (target) setClaimTarget(target);
              }}
            />
          ))}
        </div>
      )}

      {isAddOpen && (
        <AddRewardModal
          onClose={() => setIsAddOpen(false)}
          onAdd={data => {
            onAddReward(data);
            setIsAddOpen(false);
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
