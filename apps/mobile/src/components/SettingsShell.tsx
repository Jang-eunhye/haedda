import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';
import Icon from './Icon';

interface Props {
  title: string;
  /** 돌아갈 화면이 없을 때 이동할 경로 */
  backHref?: Href;
  scrollEnabled?: boolean;
  children: ReactNode;
  /** 스크롤 영역 밖에 고정으로 띄울 요소 (추가 버튼 등) */
  floating?: ReactNode;
}

export default function SettingsShell({
  title,
  backHref = '/',
  scrollEnabled = true,
  children,
  floating,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace(backHref);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="뒤로"
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
        >
          <Icon name="back" size={20} color={colors.muted} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={[styles.content, { paddingBottom: 16 + insets.bottom }]}
        scrollEnabled={scrollEnabled}
      >
        {children}
      </ScrollView>

      {floating}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPressed: {
    backgroundColor: colors.background,
  },
  title: {
    flexShrink: 1,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.foreground,
  },
  main: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
