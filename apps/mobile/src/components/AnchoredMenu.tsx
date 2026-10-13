import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '@/src/theme/colors';

interface Option<T> {
  value: T;
  label: string;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ITEM_HEIGHT = 32;
const MENU_PADDING = 4;
const MENU_MAX_HEIGHT = 232;
const MENU_OFFSET = 6;

/** 버튼 아래에 붙어서 열리는 선택 메뉴. 버튼에 ref를 달고 open()으로 연다 */
export function useAnchoredMenu() {
  const anchorRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<Rect | null>(null);

  const open = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
    });
  };
  const close = () => setAnchor(null);

  return { anchorRef, anchor, open, close };
}

interface Props<T> {
  anchor: Rect;
  options: Option<T>[];
  value: T;
  onSelect: (value: T) => void;
  onClose: () => void;
  ariaLabel: string;
  /** true면 메뉴 너비를 버튼 너비에 맞춘다 */
  matchAnchorWidth?: boolean;
}

export default function AnchoredMenu<T extends string | number>({
  anchor,
  options,
  value,
  onSelect,
  onClose,
  ariaLabel,
  matchAnchorWidth = false,
}: Props<T>) {
  const window = useWindowDimensions();
  const menuHeight = Math.min(
    options.length * ITEM_HEIGHT + MENU_PADDING * 2,
    MENU_MAX_HEIGHT
  );
  const below = anchor.y + anchor.height + MENU_OFFSET;
  const fitsBelow = below + menuHeight <= window.height - 16;
  const top = fitsBelow ? below : Math.max(16, anchor.y - menuHeight - MENU_OFFSET);

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessible={false} />
      <View
        accessibilityLabel={ariaLabel}
        style={[
          styles.menu,
          {
            top,
            right: window.width - (anchor.x + anchor.width),
            maxHeight: MENU_MAX_HEIGHT,
          },
          matchAnchorWidth && { width: anchor.width },
        ]}
      >
        <ScrollView>
          {options.map(opt => {
            const selected = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onSelect(opt.value);
                  onClose();
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ selected }}
                style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
              >
                <Text style={[styles.label, selected && styles.labelSelected]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    minWidth: 120,
    paddingVertical: MENU_PADDING,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  item: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  itemPressed: {
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
  },
  labelSelected: {
    color: colors.foreground,
    fontWeight: '500',
  },
});
