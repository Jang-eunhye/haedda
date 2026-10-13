import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';

interface Props {
  /** 뒤로가기 버튼으로 닫을 때 */
  onClose: () => void;
  /** false면 바깥 영역을 눌러도 닫히지 않는다 */
  closeOnBackdrop?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  /** 이 시트 위에 겹쳐 띄울 다른 모달 */
  overlay?: ReactNode;
}

export default function BottomSheet({
  onClose,
  closeOnBackdrop = true,
  style,
  children,
  overlay,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeOnBackdrop ? onClose : undefined}
          accessible={false}
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: 32 + insets.bottom, marginTop: insets.top + 16 },
            style,
          ]}
        >
          <View style={styles.handle} />
          {children}
        </View>
      </KeyboardAvoidingView>
      {overlay}
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.backdrop,
  },
  sheet: {
    flexShrink: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
});
