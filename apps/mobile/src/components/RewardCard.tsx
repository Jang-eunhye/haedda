import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Reward } from '@haedda/types';
import { colors } from '@/src/theme/colors';
import Icon from './Icon';
import SheetButton from './SheetButton';
import StickerStar from './StickerStar';

interface Props {
  reward: Reward;
  totalStickers: number;
  onClaim: (id: string) => void;
  onEdit: (reward: Reward) => void;
}

export default function RewardCard({ reward, totalStickers, onClaim, onEdit }: Props) {
  const canClaim = totalStickers >= reward.stickerCost;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={[styles.content, !canClaim && styles.dimmed]}>{reward.content}</Text>
        <View style={styles.side}>
          <View style={[styles.cost, !canClaim && styles.dimmed]}>
            <StickerStar size="sm" />
            <Text style={styles.costLabel}>×{reward.stickerCost}</Text>
          </View>
          <Pressable
            onPress={() => onEdit(reward)}
            accessibilityRole="button"
            accessibilityLabel="수정"
            style={({ pressed }) => [styles.edit, pressed && styles.editPressed]}
          >
            <Icon name="edit" size={18} color={colors.muted} />
          </Pressable>
        </View>
      </View>

      {canClaim ? (
        <SheetButton label="받기" onPress={() => onClaim(reward.id)} style={styles.claim} />
      ) : (
        <View style={[styles.claim, styles.unavailable]}>
          <Text style={styles.unavailableLabel}>스티커가 부족해요</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  content: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    color: colors.foreground,
  },
  dimmed: {
    opacity: 0.6,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    backgroundColor: colors.accentSoft,
  },
  costLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  edit: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editPressed: {
    backgroundColor: colors.background,
  },
  claim: {
    marginTop: 14,
    paddingVertical: 10,
  },
  unavailable: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  unavailableLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
});
