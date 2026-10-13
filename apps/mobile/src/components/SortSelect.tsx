import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/src/theme/colors';
import AnchoredMenu, { useAnchoredMenu } from './AnchoredMenu';
import Icon from './Icon';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  ariaLabel: string;
}

export default function SortSelect<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: Props<T>) {
  const { anchorRef, anchor, open, close } = useAnchoredMenu();
  const current = options.find(o => o.value === value);

  return (
    <>
      <Pressable
        ref={anchorRef}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={ariaLabel}
        accessibilityState={{ expanded: !!anchor }}
        hitSlop={8}
        style={styles.button}
      >
        <Text style={styles.label}>{current?.label}</Text>
        <Icon name={anchor ? 'chevronUp' : 'chevronDown'} size={14} color={colors.muted} />
      </Pressable>

      {anchor && (
        <AnchoredMenu
          anchor={anchor}
          options={options}
          value={value}
          onSelect={onChange}
          onClose={close}
          ariaLabel={ariaLabel}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
});
