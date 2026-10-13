import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Reward } from '@haedda/types';
import { colors } from '@/src/theme/colors';
import BottomSheet from './BottomSheet';
import Icon from './Icon';
import SheetButton from './SheetButton';
import StickerCountPicker from './StickerCountPicker';

const CONTENT_MAX = 50;

interface Props {
  onClose: () => void;
  onSave: (data: Omit<Reward, 'id'>) => void;
  onDelete?: () => void;
  reward?: Reward;
  /** 폼 위에 겹쳐 띄울 모달 (삭제 확인) */
  overlay?: ReactNode;
}

export default function RewardFormModal({ onClose, onSave, onDelete, reward, overlay }: Props) {
  const isEdit = !!reward;
  const [content, setContent] = useState(reward?.content ?? '');
  const [stickerCost, setStickerCost] = useState(reward?.stickerCost ?? 1);

  const canSubmit = !!content.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({ content: content.trim(), stickerCost });
  };

  return (
    <BottomSheet onClose={onClose} style={styles.sheet} overlay={overlay}>
      <View style={styles.header}>
        <Text style={styles.heading}>{isEdit ? '보상 수정' : '새 보상'}</Text>
        {isEdit && onDelete && (
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="삭제"
            style={({ pressed }) => [styles.delete, pressed && styles.deletePressed]}
          >
            <Icon name="delete" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.label}>보상 내용</Text>
          <View>
            <TextInput
              value={content}
              onChangeText={text => setContent(text.slice(0, CONTENT_MAX))}
              placeholder="예) 아이스크림, 게임 30분"
              placeholderTextColor={colors.mutedSoft}
              returnKeyType="done"
              style={styles.input}
            />
            <View style={styles.counterBox} pointerEvents="none">
              <Text
                style={[styles.counter, content.length >= CONTENT_MAX && styles.counterFull]}
              >
                {content.length}/{CONTENT_MAX}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.label}>필요 스티커</Text>
          <StickerCountPicker
            value={stickerCost}
            onChange={setStickerCost}
            max={99}
            inputAriaLabel="필요 스티커 개수"
          />
        </View>

        <View style={styles.actions}>
          <SheetButton label="취소" variant="secondary" onPress={onClose} style={styles.action} />
          <SheetButton
            label={isEdit ? '저장하기' : '추가하기'}
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={styles.action}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 0,
  },
  header: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 20,
  },
  heading: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.muted,
  },
  delete: {
    position: 'absolute',
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletePressed: {
    backgroundColor: colors.background,
  },
  scroll: {
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: 24,
    gap: 20,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 56,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.foreground,
  },
  counterBox: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  counter: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    color: colors.mutedSoft,
  },
  counterFull: {
    color: colors.danger,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
  },
  action: {
    flex: 1,
  },
});
