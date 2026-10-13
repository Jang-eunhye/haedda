import { StyleSheet, Text, View } from 'react-native';
import type { Reward } from '@haedda/types';
import { colors } from '@/src/theme/colors';
import BottomSheet from './BottomSheet';
import Icon from './Icon';
import SheetButton from './SheetButton';
import StickerStar from './StickerStar';

interface Props {
  reward: Reward;
  totalStickers: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClaimRewardModal({ reward, totalStickers, onClose, onConfirm }: Props) {
  const canClaim = totalStickers >= reward.stickerCost;
  const remaining = totalStickers - reward.stickerCost;

  return (
    <BottomSheet onClose={onClose}>
      <View style={styles.heading}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🎁</Text>
        </View>
        <Text style={styles.title}>{reward.content}</Text>
        <Text style={styles.subtitle}>보상을 받을까요?</Text>
      </View>

      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>현재 보유</Text>
          <Text style={styles.rowValue}>{totalStickers}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>차감 스티커</Text>
          <View style={styles.deduct}>
            <Icon name="remove" size={16} color={colors.muted} />
            <Text style={styles.rowValue}>{reward.stickerCost}</Text>
          </View>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.rowLabel}>받은 후</Text>
          <View style={styles.total}>
            <StickerStar size="sm" />
            <Text style={[styles.totalValue, !canClaim && styles.textDanger]}>
              {canClaim ? remaining : totalStickers}
            </Text>
          </View>
        </View>
      </View>

      {!canClaim && (
        <Text style={styles.shortage}>스티커가 부족해요. 할일을 완료하고 더 모아보세요!</Text>
      )}

      <View style={styles.actions}>
        <SheetButton label="취소" variant="secondary" onPress={onClose} style={styles.action} />
        <SheetButton label="받기" onPress={onConfirm} disabled={!canClaim} style={styles.action} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeIcon: {
    fontSize: 30,
    lineHeight: 38,
    includeFontPadding: false,
  },
  title: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    marginTop: 4,
  },
  summary: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  rowValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: colors.foreground,
  },
  deduct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.foreground,
  },
  textDanger: {
    color: colors.danger,
  },
  shortage: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flex: 1,
  },
});
