import { StyleSheet, Text, View } from 'react-native';
import { formatDeadlineLabel } from '@haedda/utils';
import { colors } from '@/src/theme/colors';
import BottomSheet from './BottomSheet';
import SheetButton from './SheetButton';
import StickerStar from './StickerStar';

interface Props {
  content: string;
  earned: number;
  stickerCount: number;
  isRecurring: boolean;
  nextDeadline?: string;
  onConfirm: () => void;
}

export default function TodoCompleteResultModal({
  content,
  earned,
  stickerCount,
  isRecurring,
  nextDeadline,
  onConfirm,
}: Props) {
  return (
    <BottomSheet onClose={onConfirm} closeOnBackdrop={false}>
      <View style={styles.heading}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🎉</Text>
        </View>
        <Text style={styles.title}>할일 완료!</Text>
        <Text style={styles.content}>{content}</Text>
      </View>

      {stickerCount > 0 && (
        <View style={styles.stickerBox}>
          {earned > 0 ? (
            <>
              <Text style={styles.stickerCaption}>획득 스티커</Text>
              <View style={styles.stickerAmount}>
                <Text style={styles.stickerAmountLabel}>+{earned}</Text>
                <StickerStar size="xl" />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.noSticker}>스티커 없음</Text>
              <Text style={styles.noStickerHint}>기한이 지나 스티커를 받지 못했어요</Text>
            </>
          )}
        </View>
      )}

      {isRecurring && nextDeadline && (
        <Text style={styles.next}>다음 마감: {formatDeadlineLabel(nextDeadline)}</Text>
      )}

      <SheetButton label="확인" onPress={onConfirm} />
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
    backgroundColor: colors.successSoft,
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
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  stickerBox: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  stickerCaption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.muted,
    marginBottom: 4,
  },
  stickerAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stickerAmountLabel: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.accent,
  },
  noSticker: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.muted,
  },
  noStickerHint: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 4,
  },
  next: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
});
