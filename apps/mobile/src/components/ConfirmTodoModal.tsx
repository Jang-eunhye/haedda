import { StyleSheet, Text, View } from 'react-native';
import type { Todo } from '@haedda/types';
import { isDeadlineExpired } from '@haedda/utils';
import { colors } from '@/src/theme/colors';
import BottomSheet from './BottomSheet';
import SheetButton from './SheetButton';
import StickerStar from './StickerStar';

interface Props {
  todo: Todo;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmTodoModal({ todo, onCancel, onConfirm }: Props) {
  const isExpired = isDeadlineExpired(todo.deadline);
  const expectedStickers = isExpired ? 0 : todo.stickerCount;

  return (
    <BottomSheet onClose={onCancel}>
      <View style={styles.heading}>
        <Text style={styles.title}>{todo.content}</Text>
        <Text style={styles.subtitle}>할일을 완료할까요?</Text>
      </View>

      {todo.stickerCount > 0 && (
        <View style={styles.stickerBox}>
          {expectedStickers > 0 ? (
            <>
              <Text style={styles.stickerCaption}>획득 예정 스티커</Text>
              <View style={styles.stickerAmount}>
                <Text style={styles.stickerAmountLabel}>+{expectedStickers}</Text>
                <StickerStar size="lg" />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.noSticker}>획득 스티커 없음</Text>
              <Text style={styles.noStickerHint}>기한이 지나 스티커를 받을 수 없어요</Text>
            </>
          )}
        </View>
      )}

      <Text style={styles.note}>
        {todo.recurrence
          ? '완료 후 다음 주기로 넘어갑니다'
          : '해당 할일은 목록에서 삭제됩니다'}
      </Text>

      <View style={styles.actions}>
        <SheetButton label="취소" variant="secondary" onPress={onCancel} style={styles.action} />
        <SheetButton label="완료" onPress={onConfirm} style={styles.action} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    marginTop: 6,
  },
  stickerBox: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
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
    fontSize: 24,
    lineHeight: 32,
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
  note: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flex: 1,
  },
});
