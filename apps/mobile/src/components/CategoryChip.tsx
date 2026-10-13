import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CategoryColor } from '@haedda/types';
import { CATEGORY_CHIP, colors } from '@/src/theme/colors';

const UNCATEGORIZED = {
  selected: { background: colors.white, text: colors.foreground, border: colors.foreground },
  unselected: { background: colors.white, text: colors.muted, border: colors.border },
} as const;

interface Props {
  label: string;
  /** 없으면 미분류 스타일 */
  color?: CategoryColor;
  selected: boolean;
  /** 없으면 누를 수 없는 표시용 칩 */
  onPress?: () => void;
  role?: 'tab' | 'button';
}

export default function CategoryChip({
  label,
  color,
  selected,
  onPress,
  role = 'button',
}: Props) {
  const palette = color ? CATEGORY_CHIP[color] : UNCATEGORIZED;
  const chip = selected ? palette.selected : palette.unselected;
  const chipStyle = [
    styles.chip,
    { backgroundColor: chip.background, borderColor: chip.border },
  ];
  const text = <Text style={[styles.label, { color: chip.text }]}>{label}</Text>;

  if (!onPress) return <View style={chipStyle}>{text}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityState={{ selected }}
      style={({ pressed }) => [chipStyle, pressed && styles.pressed]}
    >
      {text}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});
