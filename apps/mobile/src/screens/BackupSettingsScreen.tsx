import { useState, type ReactNode } from 'react';
import { Alert, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useBackup } from '@haedda/hooks';
import { type BackupData, parseBackup } from '@haedda/domain';
import DeleteConfirmModal from '@/src/components/DeleteConfirmModal';
import SettingsShell from '@/src/components/SettingsShell';
import SheetButton from '@/src/components/SheetButton';
import { colors } from '@/src/theme/colors';
import { afterModalClose } from '@/src/utils/afterModalClose';

function describe(data: { todos: number; rewards: number; totalStickers: number; categories: number }) {
  return `할일 ${data.todos}개, 보상 ${data.rewards}개, 스티커 ${data.totalStickers}개, 카테고리 ${data.categories}개`;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
      {children}
    </View>
  );
}

export default function BackupSettingsScreen() {
  const { exportBackup, restore, summary } = useBackup();
  const [pasted, setPasted] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<BackupData | null>(null);
  const [restoring, setRestoring] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({ message: exportBackup() });
    } catch {
      setError('공유하지 못했어요. 다시 시도해 주세요.');
    }
  };

  const handleCheck = () => {
    const result = parseBackup(pasted);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setPending(result.data);
  };

  const handleConfirm = async () => {
    if (!pending || restoring) return;
    setRestoring(true);
    try {
      // 복원하면 데이터를 다시 불러오면서 첫 화면으로 돌아간다
      await restore(pending);
      afterModalClose(() => Alert.alert('불러오기 완료', '백업한 데이터로 바꿨어요.'));
    } catch {
      setRestoring(false);
      setPending(null);
      setError('불러오는 중에 문제가 생겼어요. 다시 시도해 주세요.');
    }
  };

  return (
    <SettingsShell title="데이터 백업" backHref="/settings">
      <View style={styles.body}>
        <Text style={styles.intro}>
          해따의 데이터는 이 기기에만 저장돼요. 폰을 바꾸거나 웹에서 옮겨올 때 백업을 내보내서
          불러오세요.
        </Text>
        <Text style={styles.summary}>지금 데이터: {describe(summary)}</Text>

        <Section
          title="내보내기"
          description="백업 내용을 카카오톡 나에게 보내기, 메모 앱 등에 보관하세요."
        >
          <SheetButton label="공유하기" onPress={handleShare} />
        </Section>

        <Section
          title="불러오기"
          description="복사한 백업 내용을 붙여넣으세요. 웹에서 '복사하기'로 내보낸 내용도 돼요. 지금 데이터는 백업 내용으로 바뀌어요."
        >
          <TextInput
            value={pasted}
            onChangeText={setPasted}
            placeholder="백업 내용 붙여넣기"
            placeholderTextColor={colors.mutedSoft}
            multiline
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.input}
            accessibilityLabel="백업 내용"
          />
          <SheetButton
            label="붙여넣은 내용 불러오기"
            onPress={handleCheck}
            disabled={!pasted.trim()}
            style={styles.loadButton}
          />
          {error && (
            <Text style={styles.error} accessibilityRole="alert">
              {error}
            </Text>
          )}
        </Section>
      </View>

      {pending && (
        <DeleteConfirmModal
          title="백업을 불러올까요?"
          content={`${describe({
            todos: pending.todos.length,
            rewards: pending.rewards.length,
            totalStickers: pending.totalStickers,
            categories: pending.categories.length,
          })}로 바뀌어요. 지금 데이터는 사라져요.`}
          confirmLabel="불러오기"
          onCancel={() => setPending(null)}
          onConfirm={handleConfirm}
        />
      )}
    </SettingsShell>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  intro: {
    paddingTop: 16,
    fontSize: 14,
    lineHeight: 21,
    color: colors.foreground,
  },
  summary: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.foreground,
  },
  sectionDescription: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  input: {
    minHeight: 96,
    maxHeight: 160,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 12,
    lineHeight: 18,
    color: colors.foreground,
    textAlignVertical: 'top',
  },
  loadButton: {
    marginTop: 8,
  },
  error: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
    color: colors.danger,
  },
});
