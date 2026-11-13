import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { PlannedReminder } from '@haedda/domain';

const CHANNEL_ID = 'reminders';

// 앱을 보고 있을 때 알림이 와도 배너로 보여준다
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** 안드로이드 13 이상은 채널이 있어야 권한 요청 창이 뜬다 */
async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: '할일 알림',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function getPermissionGranted(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/** 권한을 요청하고, 허용됐는지 돌려준다. 이미 거절했다면 창 없이 false가 올 수 있다 */
export async function requestPermission(): Promise<boolean> {
  await ensureChannel();
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** 예약된 해따 알림을 모두 지우고 계획대로 다시 예약한다 */
export async function replaceScheduledReminders(plan: PlannedReminder[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (plan.length === 0) return;
  await ensureChannel();
  for (const reminder of plan) {
    await Notifications.scheduleNotificationAsync({
      identifier: reminder.id,
      content: { title: reminder.title, body: reminder.body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminder.date,
        channelId: CHANNEL_ID,
      },
    });
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
