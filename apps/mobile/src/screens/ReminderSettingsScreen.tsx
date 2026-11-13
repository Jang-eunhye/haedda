import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import SettingsShell from '@/src/components/SettingsShell';
import SortSelect from '@/src/components/SortSelect';
import ToggleSwitch from '@/src/components/ToggleSwitch';
import { useReminders } from '@/src/reminders/ReminderProvider';
import { colors } from '@/src/theme/colors';

/** 오전 6시부터 밤 11시 30분까지 30분 간격 */
const TIME_OPTIONS = Array.from({ length: 36 }, (_, i) => {
  const minutes = 6 * 60 + i * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  const period = h < 12 ? '오전' : '오후';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return { value, label: `${period} ${hour12}:${String(m).padStart(2, '0')}` };
});

function withCurrent(time: string) {
  if (TIME_OPTIONS.some(o => o.value === time)) return TIME_OPTIONS;
  return [{ value: time, label: time }, ...TIME_OPTIONS];
}

function ReminderRow({
  title,
  description,
  enabled,
  onToggle,
  time,
  onTimeChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  time: string;
  onTimeChange: (value: string) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowDescription}>{description}</Text>
        </View>
        <ToggleSwitch value={enabled} onChange={onToggle} ariaLabel={title} />
      </View>
      {enabled && (
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>시간</Text>
          <SortSelect
            value={time}
            onChange={onTimeChange}
            options={withCurrent(time)}
            ariaLabel={`${title} 시간`}
          />
        </View>
      )}
    </View>
  );
}

export default function ReminderSettingsScreen() {
  const { settings, updateSettings, permissionGranted, requestPermission } = useReminders();

  const handleAllow = async () => {
    const granted = await requestPermission();
    // 한 번 거절하면 앱에서 다시 물어볼 수 없어서 기기 설정으로 보낸다
    if (!granted) await Linking.openSettings();
  };

  return (
    <SettingsShell title="알림" backHref="/settings">
      {permissionGranted === false && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            알림 권한이 꺼져 있어서 알림을 보낼 수 없어요.
          </Text>
          <Pressable
            onPress={handleAllow}
            accessibilityRole="button"
            style={({ pressed }) => [styles.noticeButton, pressed && styles.noticeButtonPressed]}
          >
            <Text style={styles.noticeButtonLabel}>알림 허용하기</Text>
          </Pressable>
        </View>
      )}

      <ReminderRow
        title="하루 시작 알림"
        description="그날 마감인 할일과 걸린 스티커를 알려줘요"
        enabled={settings.morningEnabled}
        onToggle={value => updateSettings({ morningEnabled: value })}
        time={settings.morningTime}
        onTimeChange={value => updateSettings({ morningTime: value })}
      />
      <ReminderRow
        title="마감 알림"
        description="그날 마감인데 아직 남은 할일을 알려줘요"
        enabled={settings.deadlineEnabled}
        onToggle={value => updateSettings({ deadlineEnabled: value })}
        time={settings.deadlineTime}
        onTimeChange={value => updateSettings({ deadlineTime: value })}
      />

      <Text style={styles.footnote}>
        그날 마감인 할일이 없으면 알림을 보내지 않아요. 휴대폰 상태에 따라 몇 분 늦게 올 수
        있어요.
      </Text>
    </SettingsShell>
  );
}

const styles = StyleSheet.create({
  notice: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    gap: 12,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.foreground,
  },
  noticeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.foreground,
  },
  noticeButtonPressed: {
    opacity: 0.85,
  },
  noticeButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.foreground,
  },
  rowDescription: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
  timeRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  footnote: {
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
});
