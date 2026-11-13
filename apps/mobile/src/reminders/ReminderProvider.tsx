import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTodos } from '@haedda/hooks';
import {
  DEFAULT_REMINDER_SETTINGS,
  parseReminderSettings,
  planReminders,
  type ReminderSettings,
} from '@haedda/domain';
import {
  cancelAllReminders,
  getPermissionGranted,
  replaceScheduledReminders,
  requestPermission,
} from './notifications';

const SETTINGS_KEY = 'haedda_reminder_settings';
const PERMISSION_ASKED_KEY = 'haedda_reminder_permission_asked';
/** 할일을 연달아 바꿀 때 매번 다시 예약하지 않도록 잠깐 기다린다 */
const RESCHEDULE_DELAY = 800;

interface ReminderContextValue {
  settings: ReminderSettings;
  updateSettings: (patch: Partial<ReminderSettings>) => void;
  permissionGranted: boolean | null;
  /** 설정 화면에서 직접 켤 때: 권한을 요청하고 결과를 돌려준다 */
  requestPermission: () => Promise<boolean>;
  /** 첫 할일을 추가했을 때 한 번만 권한을 물어본다 */
  askPermissionOnce: () => void;
}

const ReminderContext = createContext<ReminderContextValue | null>(null);

export function ReminderProvider({ children }: { children: React.ReactNode }) {
  const { todos, ready } = useTodos();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const askingRef = useRef(false);

  // 저장된 설정과 현재 권한 불러오기
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        if (!cancelled) setSettings(parseReminderSettings(raw ? JSON.parse(raw) : null));
      } catch {}
      if (!cancelled) setSettingsLoaded(true);
      try {
        const granted = await getPermissionGranted();
        if (!cancelled) setPermissionGranted(granted);
      } catch {
        if (!cancelled) setPermissionGranted(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 설정 앱에서 권한을 바꾸고 돌아왔을 때 다시 확인
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') return;
      getPermissionGranted()
        .then(setPermissionGranted)
        .catch(() => {});
    });
    return () => subscription.remove();
  }, []);

  // 할일·설정·권한이 바뀌면 알림을 다시 예약
  useEffect(() => {
    if (!ready || !settingsLoaded || permissionGranted === null) return;
    const timer = setTimeout(() => {
      const task = permissionGranted
        ? replaceScheduledReminders(planReminders(todos, settings))
        : cancelAllReminders();
      task.catch(() => {});
    }, RESCHEDULE_DELAY);
    return () => clearTimeout(timer);
  }, [todos, ready, settings, settingsLoaded, permissionGranted]);

  const updateSettings = useCallback((patch: Partial<ReminderSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const request = useCallback(async () => {
    try {
      const granted = await requestPermission();
      setPermissionGranted(granted);
      return granted;
    } catch {
      return false;
    }
  }, []);

  const askPermissionOnce = useCallback(() => {
    if (askingRef.current || permissionGranted) return;
    askingRef.current = true;
    void (async () => {
      try {
        if (await AsyncStorage.getItem(PERMISSION_ASKED_KEY)) return;
        await AsyncStorage.setItem(PERMISSION_ASKED_KEY, '1');
        await request();
      } catch {}
    })();
  }, [permissionGranted, request]);

  return (
    <ReminderContext.Provider
      value={{
        settings,
        updateSettings,
        permissionGranted,
        requestPermission: request,
        askPermissionOnce,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  const ctx = useContext(ReminderContext);
  if (!ctx) {
    throw new Error('useReminders must be used within ReminderProvider');
  }
  return ctx;
}
