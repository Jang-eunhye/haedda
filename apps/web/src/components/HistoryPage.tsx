'use client';

import { useMemo } from 'react';
import { useCategories, useTodos } from '@haedda/hooks';
import {
  formatHistoryDayLabel,
  formatHistoryTime,
  groupHistoryByDay,
  summarizeHistory,
} from '@haedda/domain';
import type { HistoryEntry } from '@haedda/types';
import { getWeekRangeISO } from '@haedda/utils';
import { CATEGORY_STRIPE_CLASS } from '../utils/categories';
import EmptyState from './EmptyState';
import SettingsShell from './SettingsShell';

function SummaryTile({ label, value, tone }: { label: string; value: string; tone: 'plain' | 'accent' }) {
  return (
    <div className="flex-1 rounded-xl bg-background border border-border px-3 py-3 text-center">
      <p
        className={`text-xl font-bold tabular-nums ${tone === 'accent' ? 'text-accent' : 'text-foreground'}`}
      >
        {value}
      </p>
      <p className="text-xs text-muted mt-0.5">{label}</p>
    </div>
  );
}

function HistoryRow({ entry, stripeClass }: { entry: HistoryEntry; stripeClass?: string }) {
  const isReward = entry.type === 'reward';
  const amount = isReward
    ? `−${Math.abs(entry.stickers)}`
    : entry.stickers > 0
      ? `+${entry.stickers}`
      : '0';
  return (
    <li className="flex items-center gap-3 py-3">
      <span
        aria-hidden
        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg ${
          isReward ? 'bg-accent-soft border border-accent-muted/50' : 'bg-success-soft'
        }`}
      >
        {isReward ? '🎁' : '🎉'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-foreground leading-snug truncate">{entry.content}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
          {stripeClass && <span aria-hidden className={`w-2 h-2 rounded-full ${stripeClass}`} />}
          {isReward ? '보상 받기' : '할일 완료'} · {formatHistoryTime(entry)}
        </p>
      </div>
      <span
        className={`shrink-0 text-sm font-bold tabular-nums ${
          isReward || entry.stickers === 0 ? 'text-muted' : 'text-accent'
        }`}
        aria-label={
          isReward
            ? `스티커 ${Math.abs(entry.stickers)}개 사용`
            : `스티커 ${entry.stickers}개 받음`
        }
      >
        {amount} <span className="text-sm">⭐</span>
      </span>
    </li>
  );
}

export default function HistoryPage() {
  const { history, ready } = useTodos();
  const { categories } = useCategories();

  const week = useMemo(() => {
    const { start, end } = getWeekRangeISO();
    return summarizeHistory(history, start, end);
  }, [history]);
  const groups = useMemo(() => groupHistoryByDay(history), [history]);

  const stripeOf = (categoryId?: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? CATEGORY_STRIPE_CLASS[category.color] : undefined;
  };

  return (
    <SettingsShell title="스티커 기록">
      <section className="pt-4" aria-label="이번 주 요약">
        <p className="text-xs font-medium text-muted mb-2">이번 주</p>
        <div className="flex gap-2">
          <SummaryTile label="완료한 할일" value={`${week.completed}개`} tone="plain" />
          <SummaryTile label="모은 스티커" value={`+${week.earned}`} tone="accent" />
          <SummaryTile label="쓴 스티커" value={`−${week.spent}`} tone="plain" />
        </div>
      </section>

      {ready && history.length === 0 ? (
        <EmptyState
          icon="🎉"
          tagline="할일을 완료하고 스티커를 모아보세요"
          title="아직 기록이 없어요"
          description="할일을 완료하거나 보상을 받으면 여기에 쌓여요"
        />
      ) : (
        <div className="pt-2">
          {groups.map(group => (
            <section key={group.day} className="pt-4">
              <h2 className="text-sm font-semibold text-foreground">
                {formatHistoryDayLabel(group.day)}
              </h2>
              <ul className="divide-y divide-border">
                {group.entries.map(entry => (
                  <HistoryRow key={entry.id} entry={entry} stripeClass={stripeOf(entry.categoryId)} />
                ))}
              </ul>
            </section>
          ))}
          <p className="pt-6 text-center text-xs text-muted">최근 500개까지 기기에 저장돼요</p>
        </div>
      )}
    </SettingsShell>
  );
}
