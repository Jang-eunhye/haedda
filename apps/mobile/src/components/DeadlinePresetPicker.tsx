import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DeadlinePreset } from '@haedda/constants';
import { DEADLINE_PRESET_OPTIONS } from '@haedda/constants';
import {
  detectDeadlinePreset,
  formatDeadlineCountdown,
  formatDeadlineDisplay,
  formatPresetHint,
  getDeadlineForPreset,
} from '@haedda/utils';
import { colors } from '@/src/theme/colors';
import DatePicker from './DatePicker';
import Icon from './Icon';

interface Props {
  deadline: string | undefined;
  onChange: (deadline: string | undefined) => void;
}

type SelectedOption = DeadlinePreset | 'custom';

function DeadlineSummaryBox({ deadline }: { deadline: string | undefined }) {
  if (!deadline) return null;
  const countdown = formatDeadlineCountdown(deadline);

  return (
    <View style={styles.summary}>
      <Text style={styles.summaryLabel}>
        {formatDeadlineDisplay(deadline)}
        {countdown && <Text style={styles.summaryCountdown}>{`  ${countdown}`}</Text>}
      </Text>
    </View>
  );
}

export default function DeadlinePresetPicker({ deadline, onChange }: Props) {
  const [selected, setSelected] = useState<SelectedOption>(() =>
    detectDeadlinePreset(deadline)
  );

  const handlePreset = (next: DeadlinePreset) => {
    setSelected(next);
    if (next === 'later') {
      onChange(undefined);
      return;
    }
    onChange(getDeadlineForPreset(next));
  };

  const handleCustom = () => {
    setSelected('custom');
    if (!deadline) {
      onChange(getDeadlineForPreset('today'));
    }
  };

  const customSelected = selected === 'custom';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>기한</Text>

      <View style={styles.chips}>
        {DEADLINE_PRESET_OPTIONS.map(opt => {
          const isSelected = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => handlePreset(opt.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={handleCustom}
          accessibilityRole="button"
          accessibilityState={{ selected: customSelected }}
          style={({ pressed }) => [
            styles.chip,
            styles.customChip,
            customSelected ? styles.chipSelected : styles.customChipUnselected,
            pressed && styles.pressed,
          ]}
        >
          <Icon
            name="calendar"
            size={14}
            color={customSelected ? colors.white : colors.muted}
          />
          <Text style={[styles.chipLabel, customSelected && styles.chipLabelSelected]}>
            직접 선택
          </Text>
        </Pressable>
      </View>

      {selected === 'custom' ? (
        <>
          <DatePicker
            value={deadline ?? getDeadlineForPreset('today')}
            onChange={onChange}
          />
          {deadline && <DeadlineSummaryBox deadline={deadline} />}
        </>
      ) : selected === 'later' ? (
        <Text style={styles.hint}>{formatPresetHint('later')}</Text>
      ) : (
        deadline && <DeadlineSummaryBox deadline={deadline} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.foreground,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
  },
  chipUnselected: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  customChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customChipUnselected: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: 'rgba(24, 24, 27, 0.25)',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  chipLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  chipLabelSelected: {
    color: colors.white,
  },
  summary: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
    color: colors.muted,
  },
  summaryCountdown: {
    fontWeight: '600',
    color: colors.foreground,
  },
  hint: {
    fontSize: 12,
    lineHeight: 19,
    color: colors.muted,
  },
});
