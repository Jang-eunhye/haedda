import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import AppProviders from '@/src/providers/AppProviders';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppProviders>
      {/* 앱 색상은 라이트 모드 기준이라 시스템 다크 모드와 상관없이 라이트 테마를 쓴다 */}
      <ThemeProvider value={DefaultTheme}>
        {/* 모든 화면이 자체 헤더를 그린다 */}
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </AppProviders>
  );
}
