import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TodoRecurrence } from '@haedda/types';
import { WEEKDAY_LABELS } from '@haedda/constants';
import { colors } from '@/src/theme/colors';
import AnchoredMenu, { useAnchoredMenu } from './AnchoredMenu';
import Icon from './Icon';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

interface Props {
  frequency: RecurrenceFrequency;
  onFrequencyChange: (frequency: RecurrenceFrequency) => void;
  weekdays: number[];
  onWeekdaysChange: (weekdays: number[]) => void;
  monthlyMode: 'day' | 'last';
  onMonthlyModeChange: (mode: 'day' | 'last') => void;
  dayOfMonth: number;
  onDayOfMonthChange: (day: number) => void;
}

const FREQUENCIES: { key: RecurrenceFrequency; label: string }[] = [
  { key: 'daily', label: '매일' },
  { key: 'weekly', label: '매주' },
  { key: 'monthly', label: '매달' },
];

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}일`,
}));

export default function RecurrencePicker({
  frequency,
  onFrequencyChange,
  weekdays,
  onWeekdaysChange,
  monthlyMode,
  onMonthlyModeChange,
  dayOfMonth,
  onDayOfMonthChange,
}: Props) {
  const dayMenu = useAnchoredMenu();

  const toggleWeekday = (value: number) => {
    onWeekdaysChange(
      weekdays.includes(value)
        ? weekdays.filter(d => d !== value)
        : [...weekdays, value]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        {FREQUENCIES.map(({ key, label }) => {
          const selected = frequency === key;
          return (
            <Pressable
              key={key}
              onPress={() => onFrequencyChange(key)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.segmentItem, selected && styles.segmentItemSelected]}
            >
              <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {frequency === 'weekly' && (
        <View style={styles.weekdays}>
          {WEEKDAY_LABELS.map(({ value, label }) => {
            const selected = weekdays.includes(value);
            return (
              <Pressable
                key={value}
                onPress={() => toggleWeekday(value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${label}요일`}
                style={({ pressed }) => [
                  styles.weekday,
                  selected && styles.weekdaySelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.weekdayLabel, selected && styles.weekdayLabelSelected]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {frequency === 'monthly' && (
        <View style={styles.monthly}>
          <RadioRow
            label="매월 말일"
            selected={monthlyMode === 'last'}
            onPress={() => onMonthlyModeChange('last')}
          />

          <View>
            <RadioRow
              label="지정날짜"
              selected={monthlyMode === 'day'}
              onPress={() => onMonthlyModeChange('day')}
            />

            {monthlyMode === 'day' && (
              <View style={styles.dayRow}>
                <Text style={styles.dayPrefix}>매월</Text>
                <Pressable
                  ref={dayMenu.anchorRef}
                  onPress={dayMenu.open}
                  accessibilityRole="button"
                  accessibilityLabel={`날짜 선택, ${dayOfMonth}일`}
                  style={styles.daySelect}
                >
                  <Text style={styles.daySelectLabel}>{dayOfMonth}일</Text>
                  <Icon name="chevronDown" size={18} color={colors.muted} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}

      {dayMenu.anchor && (
        <AnchoredMenu
          anchor={dayMenu.anchor}
          options={DAY_OPTIONS}
          value={dayOfMonth}
          onSelect={onDayOfMonthChange}
          onClose={dayMenu.close}
          ariaLabel="날짜 선택"
          matchAnchorWidth
        />
      )}
    </View>
  );
}

function RadioRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={styles.radioRow}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
}

export function buildRecurrenceFromForm(
  isRecurring: boolean,
  frequency: RecurrenceFrequency,
  weekdays: number[],
  monthlyMode: 'day' | 'last',
  dayOfMonth: number
): TodoRecurrence | undefined {
  if (!isRecurring) return undefined;
  if (frequency === 'daily') return { type: 'daily' };
  if (frequency === 'weekly') return { type: 'weekly', weekdays: [...weekdays].sort() };
  if (frequency === 'monthly') {
    return {
      type: 'monthly',
      dayOfMonth: monthlyMode === 'last' ? 'last' : dayOfMonth,
    };
  }
  return undefined;
}

export function getFrequencyFromTodo(recurrence?: TodoRecurrence): RecurrenceFrequency {
  if (!recurrence) return 'daily';
  return recurrence.type;
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  segment: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  segmentItemSelected: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.muted,
  },
  segmentLabelSelected: {
    color: colors.foreground,
  },
  weekdays: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 4,
  },
  weekday: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdaySelected: {
    borderColor: colors.foreground,
    backgroundColor: colors.foreground,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  weekdayLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  weekdayLabelSelected: {
    color: colors.white,
  },
  monthly: {
    gap: 12,
    paddingTop: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.foreground,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.foreground,
  },
  radioLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.foreground,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingLeft: 32,
  },
  dayPrefix: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  daySelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  daySelectLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
  },
});
