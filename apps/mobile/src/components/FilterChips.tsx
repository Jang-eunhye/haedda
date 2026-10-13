import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '@/src/theme/colors';

interface Option<T extends string> {
  value: T;
  label: string;
  ariaLabel?: string;
}

interface Props<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  ariaLabel: string;
}

export default function FilterChips<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
      accessibilityLabel={ariaLabel}
    >
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.ariaLabel ?? opt.label}
            style={({ pressed }) => [
              styles.chip,
              selected ? styles.chipSelected : styles.chipUnselected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  labelSelected: {
    color: colors.white,
  },
});
