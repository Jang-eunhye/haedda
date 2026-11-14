import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCategories, useTodos } from '@haedda/hooks';
import {
  formatHistoryDayLabel,
  formatHistoryTime,
  groupHistoryByDay,
  summarizeHistory,
} from '@haedda/domain';
import type { HistoryEntry } from '@haedda/types';
import { getWeekRangeISO } from '@haedda/utils';
import EmptyState from '@/src/components/EmptyState';
import SettingsShell from '@/src/components/SettingsShell';
import { CATEGORY_COLOR, colors } from '@/src/theme/colors';

function SummaryTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.tile}>
      <Text style={[styles.tileValue, accent && styles.tileValueAccent]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

function HistoryRow({ entry, dotColor }: { entry: HistoryEntry; dotColor?: string }) {
  const isReward = entry.type === 'reward';
  const amount = isReward
    ? `−${Math.abs(entry.stickers)}`
    : entry.stickers > 0
      ? `+${entry.stickers}`
      : '0';
  return (
    <View style={styles.row}>
      <View
        style={[styles.rowIcon, isReward ? styles.rowIconReward : styles.rowIconTodo]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={styles.rowEmoji}>{isReward ? '🎁' : '🎉'}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {entry.content}
        </Text>
        <View style={styles.rowMeta}>
          {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
          <Text style={styles.rowMetaText}>
            {isReward ? '보상 받기' : '할일 완료'} · {formatHistoryTime(entry)}
          </Text>
        </View>
      </View>
      <Text
        style={[styles.amount, !isReward && entry.stickers > 0 && styles.amountEarned]}
        accessibilityLabel={
          isReward ? `스티커 ${Math.abs(entry.stickers)}개 사용` : `스티커 ${entry.stickers}개 받음`
        }
      >
        {amount} ⭐
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const { history, ready } = useTodos();
  const { categories } = useCategories();

  const week = useMemo(() => {
    const { start, end } = getWeekRangeISO();
    return summarizeHistory(history, start, end);
  }, [history]);
  const groups = useMemo(() => groupHistoryByDay(history), [history]);

  const dotOf = (categoryId?: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? CATEGORY_COLOR[category.color] : undefined;
  };

  return (
    <SettingsShell title="스티커 기록">
      <View style={styles.body}>
        <Text style={styles.caption}>이번 주</Text>
        <View style={styles.tiles}>
          <SummaryTile label="완료한 할일" value={`${week.completed}개`} />
          <SummaryTile label="모은 스티커" value={`+${week.earned}`} accent />
          <SummaryTile label="쓴 스티커" value={`−${week.spent}`} />
        </View>

        {ready && history.length === 0 ? (
          <EmptyState
            icon="🎉"
            tagline="할일을 완료하고 스티커를 모아보세요"
            title="아직 기록이 없어요"
            description="할일을 완료하거나 보상을 받으면 여기에 쌓여요"
          />
        ) : (
          <>
            {groups.map(group => (
              <View key={group.day} style={styles.group}>
                <Text style={styles.groupTitle} accessibilityRole="header">
                  {formatHistoryDayLabel(group.day)}
                </Text>
                {group.entries.map((entry, index) => (
                  <View key={entry.id} style={index > 0 && styles.rowDivider}>
                    <HistoryRow entry={entry} dotColor={dotOf(entry.categoryId)} />
                  </View>
                ))}
              </View>
            ))}
            <Text style={styles.footnote}>최근 500개까지 기기에 저장돼요</Text>
          </>
        )}
      </View>
    </SettingsShell>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.muted,
    marginBottom: 8,
  },
  tiles: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tileValue: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.foreground,
  },
  tileValueAccent: {
    color: colors.accent,
  },
  tileLabel: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  group: {
    paddingTop: 20,
  },
  groupTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.foreground,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconTodo: {
    backgroundColor: colors.successSoft,
  },
  rowIconReward: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentMuted,
  },
  rowEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    color: colors.foreground,
  },
  rowMeta: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rowMetaText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  amount: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.muted,
  },
  amountEarned: {
    color: colors.accent,
  },
  footnote: {
    paddingTop: 24,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
});
