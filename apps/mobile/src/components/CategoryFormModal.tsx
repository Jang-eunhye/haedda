import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  CATEGORY_COLORS,
  CATEGORY_COLOR_LABELS,
  CATEGORY_LABEL_MAX_LENGTH,
} from '@haedda/constants';
import type { CategoryColor, TodoCategory } from '@haedda/types';
import { CATEGORY_CHIP, colors } from '@/src/theme/colors';
import BottomSheet from './BottomSheet';
import SheetButton from './SheetButton';

interface Props {
  onClose: () => void;
  onSave: (data: { label: string; color: CategoryColor }) => void;
  category?: TodoCategory;
}

export default function CategoryFormModal({ onClose, onSave, category }: Props) {
  const isEdit = !!category;
  const [label, setLabel] = useState(category?.label ?? '');
  const [color, setColor] = useState<CategoryColor>(category?.color ?? 'red');

  const canSubmit = !!label.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({ label: label.trim(), color });
  };

  return (
    <BottomSheet onClose={onClose}>
      <Text style={styles.heading}>{isEdit ? '카테고리 수정' : '새 카테고리'}</Text>

      <View style={styles.body}>
        <View>
          <Text style={[styles.label, styles.nameLabel]}>이름</Text>
          <TextInput
            value={label}
            onChangeText={text => setLabel(text.slice(0, CATEGORY_LABEL_MAX_LENGTH))}
            placeholder="예: 업무"
            placeholderTextColor={colors.mutedSoft}
            autoFocus
            returnKeyType="done"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={[styles.label, styles.colorLabel]}>색상</Text>
          <View style={styles.colors} accessibilityRole="radiogroup" accessibilityLabel="카테고리 색상">
            {CATEGORY_COLORS.map(value => {
              const selected = color === value;
              const chip = selected ? CATEGORY_CHIP[value].selected : CATEGORY_CHIP[value].unselected;
              return (
                <Pressable
                  key={value}
                  onPress={() => setColor(value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={CATEGORY_COLOR_LABELS[value]}
                  style={({ pressed }) => [
                    styles.color,
                    { backgroundColor: chip.background, borderColor: chip.border },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.colorSample, { color: chip.text }]}>Aa</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <SheetButton
          label={isEdit ? '저장' : '추가'}
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={styles.submit}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    lineHeight: 36,
    fontWeight: '600',
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  body: {
    gap: 20,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.foreground,
  },
  nameLabel: {
    marginBottom: 8,
  },
  colorLabel: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.foreground,
  },
  colors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  color: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  colorSample: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  submit: {
    paddingVertical: 14,
  },
});
