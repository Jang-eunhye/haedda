import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import BottomSheet from './BottomSheet';
import SheetButton from './SheetButton';

interface Props {
  title: string;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ title, content, onCancel, onConfirm }: Props) {
  return (
    <BottomSheet onClose={onCancel}>
      <View style={styles.heading}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>

      <View style={styles.actions}>
        <SheetButton label="취소" variant="secondary" onPress={onCancel} style={styles.action} />
        <SheetButton label="삭제" onPress={onConfirm} style={styles.action} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flex: 1,
  },
});
