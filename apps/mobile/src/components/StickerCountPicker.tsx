import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/src/theme/colors';
import StickerStar from './StickerStar';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  inputAriaLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export default function StickerCountPicker({
  value,
  onChange,
  min = 1,
  max = 99,
  inputAriaLabel = '스티커 개수',
  style,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  const adjust = (delta: number) => {
    onChange(clamp(value + delta));
  };

  const startEdit = () => {
    setDraft(String(value));
    setEditing(true);
  };

  // 입력 중에 저장 버튼을 누르면 입력칸의 blur가 오지 않으므로, 입력할 때마다 값을 올려보낸다
  const changeDraft = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setDraft(digits);
    const parsed = parseInt(digits, 10);
    if (!Number.isNaN(parsed)) {
      onChange(clamp(parsed));
    }
  };

  const finishEdit = () => setEditing(false);

  return (
    <View style={[styles.container, style]}>
      <StepButton label="−" ariaLabel="줄이기" disabled={value <= min} onPress={() => adjust(-1)} />
      <View style={styles.value}>
        <StickerStar size="lg" />
        {editing ? (
          <TextInput
            autoFocus
            selectTextOnFocus
            keyboardType="number-pad"
            value={draft}
            onChangeText={changeDraft}
            onBlur={finishEdit}
            onSubmitEditing={finishEdit}
            accessibilityLabel={inputAriaLabel}
            style={[styles.count, styles.input]}
          />
        ) : (
          <Pressable
            onPress={startEdit}
            accessibilityRole="button"
            accessibilityLabel={`${inputAriaLabel} 직접 입력`}
            hitSlop={8}
          >
            <Text style={styles.count}>{value}</Text>
          </Pressable>
        )}
      </View>
      <StepButton label="+" ariaLabel="늘리기" disabled={value >= max} onPress={() => adjust(1)} />
    </View>
  );
}

function StepButton({
  label,
  ariaLabel,
  disabled,
  onPress,
}: {
  label: string;
  ariaLabel: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={ariaLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.step,
        disabled && styles.stepDisabled,
        pressed && styles.stepPressed,
      ]}
    >
      <Text style={styles.stepLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 80,
  },
  count: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.accent,
  },
  input: {
    width: 56,
    padding: 0,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(245, 158, 11, 0.4)',
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: {
    opacity: 0.3,
  },
  stepPressed: {
    transform: [{ scale: 0.95 }],
  },
  stepLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.foreground,
  },
});
