import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Todo, TodoCategory } from '@haedda/types';
import {
  formatDeadlineDDay,
  formatDeadlineDisplay,
  formatRecurrenceLabel,
  getCategoryById,
  isDeadlineExpired,
  isDeadlineToday,
  isDeadlineTomorrow,
} from '@haedda/utils';
import { colors } from '@/src/theme/colors';
import BottomSheet from './BottomSheet';
import CategoryChip from './CategoryChip';
import Icon, { type IconName } from './Icon';
import SheetButton from './SheetButton';
import StickerRow from './StickerRow';

interface Props {
  todo: Todo;
  categories: TodoCategory[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  /** 상세 위에 겹쳐 띄울 모달 (삭제 확인) */
  overlay?: ReactNode;
}

function getDeadlineStatus(deadline: string | undefined, isRecurring: boolean): string {
  if (!deadline) return '기한 없음';
  if (!isRecurring && isDeadlineExpired(deadline)) {
    return formatDeadlineDDay(deadline);
  }
  if (isDeadlineToday(deadline)) return '오늘까지';
  if (isDeadlineTomorrow(deadline)) return '내일까지';
  return formatDeadlineDDay(deadline);
}

function HeaderButton({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
    >
      <Icon name={icon} size={icon === 'close' ? 20 : 18} color={colors.muted} />
    </Pressable>
  );
}

function InfoRow({
  label,
  first = false,
  children,
}: {
  label: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={[styles.infoRow, !first && styles.infoRowDivider]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValue}>{children}</View>
    </View>
  );
}

export default function TodoDetailModal({
  todo,
  categories,
  onClose,
  onEdit,
  onDelete,
  onComplete,
  overlay,
}: Props) {
  const isExpired = isDeadlineExpired(todo.deadline);
  const isRecurring = !!todo.recurrence;
  const missedCount = todo.missedCount ?? 0;
  const streak = todo.consecutiveCompletions ?? 0;
  const isOneTimeExpired = isExpired && !isRecurring;
  const deadlineStatus = getDeadlineStatus(todo.deadline, isRecurring);
  const showStreak = isRecurring && streak > 0;
  const showMissed = isRecurring && missedCount > 0;
  const category = todo.categoryId
    ? getCategoryById(categories, todo.categoryId)
    : undefined;

  return (
    <BottomSheet onClose={onClose} style={styles.sheet} overlay={overlay}>
      <View style={styles.header}>
        <HeaderButton icon="close" label="닫기" onPress={onClose} />
        <Text style={styles.headerTitle} pointerEvents="none">
          할일 상세
        </Text>
        <View style={styles.headerActions}>
          <HeaderButton icon="edit" label="수정" onPress={onEdit} />
          <HeaderButton icon="delete" label="삭제" onPress={onDelete} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        {todo.stickerCount > 0 && (
          <View style={styles.stickers}>
            <StickerRow
              count={todo.stickerCount}
              size="lg"
              crossedOut={isOneTimeExpired}
              centered
              gap={4}
            />
            {isOneTimeExpired && (
              <Text style={styles.stickerHint}>기한이 지나 스티커를 받을 수 없어요</Text>
            )}
          </View>
        )}

        <Text style={[styles.content, todo.stickerCount > 0 && styles.contentWithStickers]}>
          {todo.content}
        </Text>

        {todo.memo && (
          <View style={styles.memo}>
            <Text style={styles.memoText}>{todo.memo}</Text>
          </View>
        )}

        {showStreak && (
          <View style={[styles.stat, styles.statSuccess]}>
            <Text style={[styles.statValue, styles.textSuccess]}>{streak}</Text>
            <Text style={styles.statLabel}>연속 완료</Text>
          </View>
        )}

        {showMissed && (
          <View style={[styles.stat, styles.statDanger]}>
            <Text style={[styles.statValue, styles.textDanger]}>{missedCount}</Text>
            <Text style={styles.statLabel}>미완료</Text>
          </View>
        )}

        <View style={styles.info}>
          <InfoRow label="카테고리" first>
            {category ? (
              <CategoryChip label={category.label} color={category.color} selected />
            ) : (
              <Text style={[styles.infoText, styles.textMuted]}>미분류</Text>
            )}
          </InfoRow>
          <InfoRow label="마감일">
            <Text style={styles.infoText}>{formatDeadlineDisplay(todo.deadline)}</Text>
          </InfoRow>
          <InfoRow label="남은 기한">
            <Text style={[styles.infoText, isOneTimeExpired && styles.textDanger]}>
              {deadlineStatus}
            </Text>
          </InfoRow>
          {todo.recurrence && (
            <InfoRow label="반복">
              <Text style={styles.infoText}>{formatRecurrenceLabel(todo.recurrence)}</Text>
            </InfoRow>
          )}
        </View>

        {isRecurring && (
          <Text style={styles.recurringHint}>완료하면 다음 주기로 자동 넘어가요</Text>
        )}

        <SheetButton label="완료하기" onPress={onComplete} style={styles.complete} />
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 12,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
    paddingHorizontal: 20,
    marginTop: -4,
    marginBottom: 8,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.muted,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 2,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPressed: {
    backgroundColor: colors.background,
  },
  scroll: {
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: 20,
  },
  stickers: {
    paddingVertical: 8,
  },
  stickerHint: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
    marginTop: 4,
  },
  contentWithStickers: {
    marginTop: 12,
  },
  memo: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  memoText: {
    fontSize: 14,
    lineHeight: 23,
    color: colors.foreground,
  },
  stat: {
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  statSuccess: {
    backgroundColor: colors.successSoft,
    borderColor: colors.successBorder,
  },
  statDanger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerBorder,
  },
  statValue: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 2,
  },
  info: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoRowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  infoValue: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.foreground,
    textAlign: 'right',
  },
  textMuted: {
    color: colors.muted,
  },
  textDanger: {
    color: colors.danger,
  },
  textSuccess: {
    color: colors.success,
  },
  recurringHint: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 12,
  },
  complete: {
    marginTop: 20,
    paddingVertical: 14,
  },
});
