import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { PRIVACY_POLICY_URL } from '@haedda/constants';
import Icon from '@/src/components/Icon';
import SettingsShell from '@/src/components/SettingsShell';
import { colors } from '@/src/theme/colors';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SettingsShell title="설정">
      <View accessibilityLabel="설정 메뉴">
        <Pressable
          onPress={() => router.push('/settings/categories')}
          accessibilityRole="link"
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
        >
          <Text style={styles.label}>카테고리 관리</Text>
          <Icon name="chevronRight" size={20} color={colors.muted} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/settings/backup')}
          accessibilityRole="link"
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
        >
          <Text style={styles.label}>데이터 백업</Text>
          <Icon name="chevronRight" size={20} color={colors.muted} />
        </Pressable>
        <Pressable
          onPress={() => openBrowserAsync(PRIVACY_POLICY_URL)}
          accessibilityRole="link"
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
        >
          <Text style={styles.label}>개인정보처리방침</Text>
          <Icon name="chevronRight" size={20} color={colors.muted} />
        </Pressable>
      </View>
    </SettingsShell>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemPressed: {
    backgroundColor: colors.background,
  },
  label: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.foreground,
  },
});
