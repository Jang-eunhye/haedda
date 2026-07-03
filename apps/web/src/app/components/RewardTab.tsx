'use client';

import { useState } from 'react';
import { Reward } from '@haedda/types';
import RewardCard from './RewardCard';
import RewardFormModal from './RewardFormModal';
import ClaimRewardModal from './ClaimRewardModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import EmptyState from './EmptyState';
import Fab from './Fab';

const APP_TAGLINE = '할일을 완료하고 스티커를 모아보세요';

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
  const [deleteTarget, setDeleteTarget] = useState<Reward | null>(null);

  const handleClaimConfirm = () => {
    if (!claimTarget) return;
    const success = onClaimReward(claimTarget.id);
    if (success) setClaimTarget(null);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {rewards.length === 0 ? (
        <EmptyState
          icon="🎁"
          tagline={APP_TAGLINE}
          title="아직 보상이 없어요"
          description="받고 싶은 보상을 추가하고 스티커로 교환해 보세요"
        />
      ) : (
        <>
          <div className="shrink-0 mb-3">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              보상
              <span className="text-sm font-semibold text-muted tabular-nums">({rewards.length})</span>
            </h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto pb-20">
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
                  onEdit={setEditTarget}
                />
              ))}
            </div>
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
          onDelete={() => setDeleteTarget(editTarget)}
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

      {deleteTarget && (
        <DeleteConfirmModal
          title="보상을 삭제할까요?"
          content={deleteTarget.content}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            onDeleteReward(deleteTarget.id);
            setDeleteTarget(null);
            setEditTarget(null);
          }}
        />
      )}

      <Fab onClick={() => setIsAddOpen(true)} label="보상 추가" />
    </div>
  );
}
