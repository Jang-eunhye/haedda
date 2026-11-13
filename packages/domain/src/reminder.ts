import type { Todo } from '@haedda/types';
import { computeNextDeadlineAfter, formatDateISO, normalizeDeadline } from '@haedda/utils';

export interface ReminderSettings {
  /** 하루 시작 알림: 그날 마감인 할일 개수와 걸린 스티커 */
  morningEnabled: boolean;
  /** 'HH:MM' */
  morningTime: string;
  /** 마감 알림: 그날 마감인데 아직 남은 할일 */
  deadlineEnabled: boolean;
  /** 'HH:MM' */
  deadlineTime: string;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  morningEnabled: true,
  morningTime: '09:00',
  deadlineEnabled: true,
  deadlineTime: '20:00',
};

/** 미리 예약해 두는 날 수. 기기마다 예약 개수 제한이 있어서 짧게 잡고, 앱을 열 때마다 다시 채운다 */
export const REMINDER_DAYS_AHEAD = 7;

export interface PlannedReminder {
  /** 같은 알림을 다시 예약할 때 구분하는 값 */
  id: string;
  date: Date;
  title: string;
  body: string;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidReminderTime(time: string): boolean {
  return TIME_PATTERN.test(time);
}

/** 저장된 값이 깨졌거나 예전 형식이어도 기본값으로 채워서 돌려준다 */
export function parseReminderSettings(raw: unknown): ReminderSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_REMINDER_SETTINGS };
  const value = raw as Partial<Record<keyof ReminderSettings, unknown>>;
  const pickBool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
  const pickTime = (v: unknown, fallback: string) =>
    typeof v === 'string' && isValidReminderTime(v) ? v : fallback;
  return {
    morningEnabled: pickBool(value.morningEnabled, DEFAULT_REMINDER_SETTINGS.morningEnabled),
    morningTime: pickTime(value.morningTime, DEFAULT_REMINDER_SETTINGS.morningTime),
    deadlineEnabled: pickBool(value.deadlineEnabled, DEFAULT_REMINDER_SETTINGS.deadlineEnabled),
    deadlineTime: pickTime(value.deadlineTime, DEFAULT_REMINDER_SETTINGS.deadlineTime),
  };
}

function atTime(day: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m, 0, 0);
}

/**
 * 할일별로 앞으로 days일 안의 마감일 목록을 만든다.
 * 반복 할일은 지금 마감일 다음 회차들도 넣는다 (앱을 안 열어도 매일 알림 개수가 맞도록).
 */
function collectDueDates(todo: Todo, firstDay: string, lastDay: string): string[] {
  if (!todo.deadline) return [];
  const dates: string[] = [];
  let current = normalizeDeadline(todo.deadline);

  // 반복 할일의 마감일이 이미 지났으면 오늘 이후 회차까지 넘긴다
  if (todo.recurrence) {
    let guard = 0;
    while (current < firstDay && guard < 400) {
      current = computeNextDeadlineAfter(todo.recurrence, current);
      guard += 1;
    }
  }

  let guard = 0;
  while (current <= lastDay && guard < 400) {
    if (current >= firstDay) dates.push(current);
    if (!todo.recurrence) break;
    current = computeNextDeadlineAfter(todo.recurrence, current);
    guard += 1;
  }
  return dates;
}

function describeTodos(todos: Todo[]): string {
  const first = todos[0]?.content ?? '';
  return todos.length > 1 ? `'${first}' 외 ${todos.length - 1}개` : `'${first}'`;
}

/**
 * 지금 할일 목록으로 앞으로 예약할 알림을 계산한다.
 * 이미 지난 시각, 할일이 없는 날은 빼고, 시간 순으로 돌려준다.
 */
export function planReminders(
  todos: Todo[],
  settings: ReminderSettings,
  now: Date = new Date(),
  days: number = REMINDER_DAYS_AHEAD
): PlannedReminder[] {
  if (!settings.morningEnabled && !settings.deadlineEnabled) return [];

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayList: Date[] = [];
  for (let i = 0; i < days; i += 1) {
    dayList.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
  }
  const firstDay = formatDateISO(dayList[0]);
  const lastDay = formatDateISO(dayList[dayList.length - 1]);

  const dueByDay = new Map<string, Todo[]>();
  for (const todo of todos) {
    for (const date of collectDueDates(todo, firstDay, lastDay)) {
      const list = dueByDay.get(date) ?? [];
      list.push(todo);
      dueByDay.set(date, list);
    }
  }

  const planned: PlannedReminder[] = [];
  for (const day of dayList) {
    const key = formatDateISO(day);
    const due = dueByDay.get(key) ?? [];
    if (due.length === 0) continue;

    if (settings.morningEnabled) {
      const date = atTime(day, settings.morningTime);
      if (date > now) {
        const stickers = due.reduce((sum, t) => sum + t.stickerCount, 0);
        planned.push({
          id: `morning-${key}`,
          date,
          title: `오늘 할일 ${due.length}개`,
          body:
            stickers > 0
              ? `${describeTodos(due)} · 스티커 ${stickers}개가 기다려요 ⭐`
              : `${describeTodos(due)} · 오늘도 해따!`,
        });
      }
    }

    if (settings.deadlineEnabled) {
      const date = atTime(day, settings.deadlineTime);
      if (date > now) {
        planned.push({
          id: `deadline-${key}`,
          date,
          title: `오늘 마감 할일이 ${due.length}개 남았어요`,
          body: `${describeTodos(due)} · 자기 전에 끝내 볼까요?`,
        });
      }
    }
  }

  return planned.sort((a, b) => a.date.getTime() - b.date.getTime());
}
