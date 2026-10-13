import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import Icon from './Icon';

interface Props {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FilterExcludeOption({ label, checked, onChange }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={8}
      style={styles.row}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Icon name="check" size={12} color={colors.white} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  box: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: colors.foreground,
    backgroundColor: colors.foreground,
  },
});
