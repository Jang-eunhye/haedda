import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Reward } from '@haedda/types';
import { colors } from '@/src/theme/colors';
import ClaimRewardModal from './ClaimRewardModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import EmptyState from './EmptyState';
import Fab from './Fab';
import RewardCard from './RewardCard';
import RewardFormModal from './RewardFormModal';

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
  const insets = useSafeAreaInsets();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Reward | null>(null);
  const [claimTarget, setClaimTarget] = useState<Reward | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reward | null>(null);

  const handleClaimConfirm = () => {
    if (!claimTarget) return;
    const success = onClaimReward(claimTarget.id);
    if (success) setClaimTarget(null);
  };

  const deleteConfirmModal = deleteTarget && (
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
  );

  return (
    <View style={styles.tab}>
      {rewards.length === 0 ? (
        <EmptyState
          icon="🎁"
          tagline={APP_TAGLINE}
          title="아직 보상이 없어요"
          description="받고 싶은 보상을 추가하고 스티커로 교환해 보세요"
        />
      ) : (
        <>
          <Text style={styles.title} accessibilityRole="header">
            보상<Text style={styles.count}>({rewards.length})</Text>
          </Text>
          <FlatList
            data={rewards}
            keyExtractor={reward => reward.id}
            style={styles.list}
            contentContainerStyle={[styles.listContent, { paddingBottom: 96 + insets.bottom }]}
            renderItem={({ item }) => (
              <RewardCard
                reward={item}
                totalStickers={totalStickers}
                onClaim={id => {
                  const target = rewards.find(r => r.id === id);
                  if (target) setClaimTarget(target);
                }}
                onEdit={setEditTarget}
              />
            )}
          />
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
          overlay={deleteConfirmModal}
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

      <Fab onPress={() => setIsAddOpen(true)} label="보상 추가" />
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: colors.muted,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
  },
});
