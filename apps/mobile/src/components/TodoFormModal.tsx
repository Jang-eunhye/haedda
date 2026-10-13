import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Todo, TodoCategory, TodoInput } from '@haedda/types';
import { computeNextDeadline, getTodayISO, normalizeDeadline } from '@haedda/utils';
import { colors } from '@/src/theme/colors';
import BottomSheet from './BottomSheet';
import CategoryPicker from './CategoryPicker';
import DeadlinePresetPicker from './DeadlinePresetPicker';
import Icon from './Icon';
import RecurrencePicker, {
  buildRecurrenceFromForm,
  getFrequencyFromTodo,
  type RecurrenceFrequency,
} from './RecurrencePicker';
import SheetButton from './SheetButton';
import StickerCountPicker from './StickerCountPicker';
import ToggleSwitch from './ToggleSwitch';

const CONTENT_MAX = 50;
const MEMO_MAX = 200;

interface Props {
  onClose: () => void;
  onSave: (data: TodoInput) => void;
  categories: TodoCategory[];
  todo?: Todo;
}

function Section({ children }: { children: ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}

function Counter({ length, max }: { length: number; max: number }) {
  return (
    <Text style={[styles.counter, length >= max && styles.counterFull]}>
      {length}/{max}
    </Text>
  );
}

export default function TodoFormModal({ onClose, onSave, categories, todo }: Props) {
  const isEdit = !!todo;
  const [content, setContent] = useState(todo?.content ?? '');
  const [memo, setMemo] = useState(todo?.memo ?? '');
  const [deadline, setDeadline] = useState<string | undefined>(
    todo?.deadline ? normalizeDeadline(todo.deadline) : getTodayISO()
  );
  const [stickerCount, setStickerCount] = useState(
    todo && todo.stickerCount > 0 ? todo.stickerCount : 1
  );
  const [hasSticker, setHasSticker] = useState((todo?.stickerCount ?? 0) > 0);
  const [isRecurring, setIsRecurring] = useState(!!todo?.recurrence);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(
    getFrequencyFromTodo(todo?.recurrence)
  );
  const [weekdays, setWeekdays] = useState<number[]>(todo?.recurrence?.weekdays ?? []);
  const [monthlyMode, setMonthlyMode] = useState<'day' | 'last'>(() => {
    if (todo?.recurrence?.type === 'monthly') {
      return todo.recurrence.dayOfMonth === 'last' ? 'last' : 'day';
    }
    return 'last';
  });
  const [dayOfMonth, setDayOfMonth] = useState<number>(
    typeof todo?.recurrence?.dayOfMonth === 'number' ? todo.recurrence.dayOfMonth : 1
  );
  const [memoOpen, setMemoOpen] = useState(!!todo?.memo?.trim());
  const [categoryId, setCategoryId] = useState<string | undefined>(todo?.categoryId);

  const canSubmit =
    !!content.trim() &&
    (isRecurring ? frequency !== 'weekly' || weekdays.length > 0 : true);

  const handleSubmit = () => {
    if (!canSubmit) return;

    const recurrence = buildRecurrenceFromForm(
      isRecurring,
      frequency,
      weekdays,
      monthlyMode,
      dayOfMonth
    );

    let finalDeadline = deadline;
    if (recurrence) {
      finalDeadline = computeNextDeadline(recurrence, new Date(), true);
    }

    const trimmedMemo = memo.trim();
    onSave({
      content: content.trim(),
      deadline: finalDeadline,
      stickerCount: hasSticker ? stickerCount : 0,
      memo: trimmedMemo || undefined,
      recurrence,
      categoryId,
    });
  };

  return (
    <BottomSheet onClose={onClose} style={styles.sheet}>
      <Text style={styles.heading}>{isEdit ? '할일 수정' : '새 할일'}</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={[styles.label, styles.labelSpacing]}>할일 내용</Text>
          <View>
            <TextInput
              value={content}
              onChangeText={text => setContent(text.slice(0, CONTENT_MAX))}
              placeholder="무엇을 할까요?"
              placeholderTextColor={colors.mutedSoft}
              multiline
              style={[styles.input, styles.contentInput]}
            />
            <Counter length={content.length} max={CONTENT_MAX} />
          </View>
        </View>

        <Section>
          <Text style={[styles.label, styles.labelSpacing]}>
            카테고리 <Text style={styles.optional}>(선택)</Text>
          </Text>
          <CategoryPicker value={categoryId} onChange={setCategoryId} categories={categories} />
        </Section>

        <Section>
          <Pressable
            onPress={() => setMemoOpen(open => !open)}
            accessibilityRole="button"
            accessibilityState={{ expanded: memoOpen }}
            style={styles.row}
          >
            <Text style={styles.label}>
              메모 <Text style={styles.optional}>(선택)</Text>
            </Text>
            <Icon name={memoOpen ? 'chevronUp' : 'chevronDown'} size={20} color={colors.muted} />
          </Pressable>
          {memoOpen && (
            <View style={styles.memo}>
              <TextInput
                value={memo}
                onChangeText={text => setMemo(text.slice(0, MEMO_MAX))}
                placeholder="메모를 남겨보세요"
                placeholderTextColor={colors.mutedSoft}
                multiline
                style={[styles.input, styles.memoInput]}
              />
              <Counter length={memo.length} max={MEMO_MAX} />
            </View>
          )}
        </Section>

        <Section>
          <View style={styles.row}>
            <Text style={styles.label}>반복 할일</Text>
            <ToggleSwitch value={isRecurring} onChange={setIsRecurring} ariaLabel="반복 할일" />
          </View>

          {isRecurring && (
            <View style={styles.expanded}>
              <RecurrencePicker
                frequency={frequency}
                onFrequencyChange={setFrequency}
                weekdays={weekdays}
                onWeekdaysChange={setWeekdays}
                monthlyMode={monthlyMode}
                onMonthlyModeChange={setMonthlyMode}
                dayOfMonth={dayOfMonth}
                onDayOfMonthChange={setDayOfMonth}
              />
            </View>
          )}
        </Section>

        {!isRecurring && (
          <Section>
            <DeadlinePresetPicker deadline={deadline} onChange={setDeadline} />
          </Section>
        )}

        <Section>
          <View style={styles.row}>
            <Text style={styles.label}>스티커 걸기</Text>
            <ToggleSwitch value={hasSticker} onChange={setHasSticker} ariaLabel="스티커 걸기" />
          </View>

          {hasSticker && (
            <StickerCountPicker
              style={styles.expanded}
              value={stickerCount}
              onChange={setStickerCount}
              max={10}
              inputAriaLabel="스티커 개수"
            />
          )}
          {!isEdit && <Text style={styles.hint}>완료하면 스티커를 받을 수 있어요</Text>}
        </Section>

        <View style={styles.actions}>
          <SheetButton label="취소" variant="secondary" onPress={onClose} style={styles.action} />
          <SheetButton
            label={isEdit ? '저장하기' : '추가하기'}
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={styles.action}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 0,
  },
  heading: {
    fontSize: 14,
    lineHeight: 36,
    fontWeight: '600',
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  scroll: {
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: 24,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.foreground,
  },
  labelSpacing: {
    marginBottom: 8,
  },
  optional: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.muted,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 21,
    color: colors.foreground,
    textAlignVertical: 'top',
  },
  contentInput: {
    paddingRight: 56,
  },
  memo: {
    marginTop: 8,
  },
  memoInput: {
    minHeight: 88,
    paddingBottom: 28,
  },
  counter: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    fontSize: 12,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
    color: colors.mutedSoft,
  },
  counterFull: {
    color: colors.danger,
  },
  expanded: {
    marginTop: 16,
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 20,
    marginTop: 20,
  },
  action: {
    flex: 1,
  },
});
