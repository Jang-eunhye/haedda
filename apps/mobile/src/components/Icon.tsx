import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

type SymbolName = Exclude<SymbolViewProps['name'], string>;

const ICONS = {
  add: { ios: 'plus', android: 'add', web: 'add' },
  back: { ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' },
  calendar: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  chevronDown: {
    ios: 'chevron.down',
    android: 'keyboard_arrow_down',
    web: 'keyboard_arrow_down',
  },
  chevronLeft: { ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  chevronUp: { ios: 'chevron.up', android: 'keyboard_arrow_up', web: 'keyboard_arrow_up' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  delete: { ios: 'trash', android: 'delete', web: 'delete' },
  drag: { ios: 'line.3.horizontal', android: 'drag_indicator', web: 'drag_indicator' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  remove: { ios: 'minus', android: 'remove', web: 'remove' },
  repeat: { ios: 'arrow.triangle.2.circlepath', android: 'autorenew', web: 'autorenew' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
  store: { ios: 'storefront', android: 'storefront', web: 'storefront' },
  warning: {
    ios: 'exclamationmark.triangle',
    android: 'warning_amber',
    web: 'warning_amber',
  },
} satisfies Record<string, SymbolName>;

export type IconName = keyof typeof ICONS;

interface Props {
  name: IconName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<ViewStyle>;
}

export default function Icon({ name, size = 20, color, style }: Props) {
  return (
    <SymbolView
      name={ICONS[name]}
      size={size}
      tintColor={color}
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
