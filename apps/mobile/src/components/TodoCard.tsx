import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Todo, TodoCategory } from '@haedda/types';
import {
  formatDeadlineCardLine,
  formatRecurrenceLabel,
  isDeadlineExpired,
} from '@haedda/utils';
import { colors } from '@/src/theme/colors';
import CategoryStripe from './CategoryStripe';
import Icon from './Icon';
import StickerRow from './StickerRow';

interface Props {
  todo: Todo;
  categories: TodoCategory[];
  onComplete: (id: string) => void;
  onOpen: (todo: Todo) => void;
}

export default function TodoCard({ todo, categories, onComplete, onOpen }: Props) {
  const isExpired = isDeadlineExpired(todo.deadline);
  const isRecurring = !!todo.recurrence;
  const missedCount = todo.missedCount ?? 0;
  const streak = todo.consecutiveCompletions ?? 0;
  const isOneTimeExpired = !isRecurring && isExpired;
  const deadlineLine = formatDeadlineCardLine(todo.deadline);
  const showStickerRow = todo.stickerCount > 0;
  const showRecurringStatus =
    (isRecurring && missedCount > 0) || (isRecurring && missedCount === 0 && streak > 0);
  const showMetaSection = showRecurringStatus || !!deadlineLine;

  return (
    <View style={styles.card}>
      {todo.categoryId && (
        <CategoryStripe categoryId={todo.categoryId} categories={categories} />
      )}
      <Pressable
        onPress={() => onOpen(todo)}
        accessibilityRole="button"
        style={({ pressed }) => [styles.body, pressed && styles.bodyPressed]}
      >
        <View style={styles.main}>
          {showStickerRow && (
            <StickerRow count={todo.stickerCount} size="md" crossedOut={isOneTimeExpired} />
          )}

          <View style={styles.titleRow}>
            {todo.recurrence && (
              <View style={styles.recurrenceBadge}>
                <Icon name="repeat" size={12} color={colors.accent} />
                <Text style={styles.recurrenceLabel}>
                  {formatRecurrenceLabel(todo.recurrence)}
                </Text>
              </View>
            )}
            <Text style={styles.content}>{todo.content}</Text>
          </View>
        </View>

        {showMetaSection && (
          <View style={styles.meta}>
            {isRecurring && missedCount > 0 && (
              <Text style={[styles.status, styles.textDanger]}>미완료 {missedCount}회</Text>
            )}

            {isRecurring && missedCount === 0 && streak > 0 && (
              <Text style={[styles.status, styles.textSuccess]}>{streak}회 연속 완료</Text>
            )}

            {deadlineLine && (
              <View style={styles.deadlineRow}>
                <Icon
                  name="calendar"
                  size={14}
                  color={isOneTimeExpired ? colors.danger : colors.muted}
                />
                <Text style={[styles.status, isOneTimeExpired && styles.textDanger]}>
                  {deadlineLine.label}
                </Text>
                <View style={[styles.dday, isOneTimeExpired && styles.ddayExpired]}>
                  <Text style={[styles.ddayLabel, isOneTimeExpired && styles.textDanger]}>
                    {deadlineLine.dday}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </Pressable>

      <Pressable
        onPress={() => onComplete(todo.id)}
        accessibilityRole="button"
        accessibilityLabel="완료하기"
        style={({ pressed }) => [styles.complete, pressed && styles.completePressed]}
      >
        <Icon name="check" size={20} color={colors.surface} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  body: {
    flex: 1,
    minWidth: 0,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  bodyPressed: {
    backgroundColor: colors.background,
  },
  main: {
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 6,
    rowGap: 2,
  },
  recurrenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    backgroundColor: colors.accentSoft,
  },
  recurrenceLabel: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  content: {
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    color: colors.foreground,
  },
  meta: {
    gap: 4,
  },
  status: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  textDanger: {
    color: colors.danger,
  },
  textSuccess: {
    color: colors.success,
  },
  deadlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  dday: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  ddayExpired: {
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerSoft,
  },
  ddayLabel: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: colors.muted,
  },
  complete: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.foreground,
  },
  completePressed: {
    opacity: 0.8,
  },
});
