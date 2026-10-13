import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/src/theme/colors';

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  ariaLabel: string;
}

export default function ToggleSwitch({ value, onChange, ariaLabel }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={ariaLabel}
      hitSlop={6}
      style={[styles.track, value && styles.trackOn]}
    >
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 4,
    backgroundColor: colors.border,
  },
  trackOn: {
    backgroundColor: colors.foreground,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  knobOn: {
    transform: [{ translateX: 20 }],
  },
});
