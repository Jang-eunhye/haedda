import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { AppDataProvider } from '@haedda/hooks';
import { getTodayISO } from '@haedda/utils';
import { appStorage } from '@/src/storage';

/**
 * 앱이 백그라운드에 있다가 날짜가 바뀐 뒤 다시 열리면 데이터를 새로 불러온다.
 * 반복 할일의 다음 마감일·놓친 횟수와 '오늘' 필터는 불러올 때 계산되는데,
 * 앱은 웹과 달리 며칠씩 다시 시작되지 않고 이어서 열리기 때문이다.
 */
function useDayKey() {
  const [dayKey, setDayKey] = useState(getTodayISO);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') return;
      const today = getTodayISO();
      setDayKey(prev => (prev === today ? prev : today));
    });
    return () => subscription.remove();
  }, []);

  return dayKey;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const dayKey = useDayKey();

  return (
    // key가 바뀌면 저장소에서 다시 불러온다 (화면은 첫 화면으로 돌아간다)
    <AppDataProvider key={dayKey} storage={appStorage}>
      {children}
    </AppDataProvider>
  );
}
