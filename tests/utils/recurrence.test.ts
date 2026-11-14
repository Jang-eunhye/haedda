import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Todo } from '@haedda/types';
import {
  computeCurrentPeriodDeadline,
  computeNextDeadlineAfter,
  countMissedPeriods,
  formatRecurrenceLabel,
  getRecurrenceStatus,
  refreshRecurringTodo,
} from '@haedda/utils';
import { NOW, freezeTime, unfreezeTime } from '../helpers.ts';

describe('반복 할일', () => {
  before(() => freezeTime());
  after(() => unfreezeTime());

  it('다음 마감일: 매일은 하루 뒤', () => {
    assert.equal(computeNextDeadlineAfter({ type: 'daily' }, '2026-11-14'), '2026-11-15');
    assert.equal(computeNextDeadlineAfter({ type: 'daily' }, '2026-12-31'), '2027-01-01');
  });

  it('다음 마감일: 매주는 다음으로 고른 요일', () => {
    // 월(1)·수(3)·금(5), 기준 11/14 토요일 → 11/16 월요일
    const weekly = { type: 'weekly' as const, weekdays: [1, 3, 5] };
    assert.equal(computeNextDeadlineAfter(weekly, '2026-11-14'), '2026-11-16');
    assert.equal(computeNextDeadlineAfter(weekly, '2026-11-16'), '2026-11-18');
    assert.equal(computeNextDeadlineAfter(weekly, '2026-11-20'), '2026-11-23');
  });

  it('다음 마감일: 매월 31일은 짧은 달에 그 달 말일로 맞춘다', () => {
    const monthly31 = { type: 'monthly' as const, dayOfMonth: 31 };
    assert.equal(computeNextDeadlineAfter(monthly31, '2027-01-31'), '2027-02-28');
    assert.equal(computeNextDeadlineAfter({ type: 'monthly', dayOfMonth: 'last' }, '2026-11-30'), '2026-12-31');
    assert.equal(computeNextDeadlineAfter({ type: 'monthly', dayOfMonth: 15 }, '2026-11-15'), '2026-12-15');
  });

  it('이번 주기 마감일', () => {
    assert.equal(computeCurrentPeriodDeadline({ type: 'daily' }, NOW), '2026-11-14');
    // 이번 주(11/9~15) 월·수·금 중 오늘(토) 전 마지막 → 11/13 금
    assert.equal(computeCurrentPeriodDeadline({ type: 'weekly', weekdays: [1, 3, 5] }, NOW), '2026-11-13');
    assert.equal(computeCurrentPeriodDeadline({ type: 'monthly', dayOfMonth: 'last' }, NOW), '2026-11-30');
  });

  it('놓친 주기 수를 센다', () => {
    assert.equal(countMissedPeriods({ type: 'daily' }, '2026-11-11', '2026-11-14'), 3);
    assert.equal(countMissedPeriods({ type: 'daily' }, '2026-11-14', '2026-11-14'), 0);
  });

  it('지난 반복 할일을 이번 주기로 옮기고 미완료 횟수를 더한다', () => {
    const todo: Todo = {
      id: 'a',
      content: '물 마시기',
      stickerCount: 1,
      deadline: '2026-11-12',
      recurrence: { type: 'daily' },
      missedCount: 1,
      consecutiveCompletions: 4,
    };
    const refreshed = refreshRecurringTodo(todo);
    assert.equal(refreshed.deadline, '2026-11-14');
    assert.equal(refreshed.missedCount, 3);
    assert.equal(refreshed.consecutiveCompletions, 4);
  });

  it('아직 지나지 않은 반복 할일은 그대로 둔다', () => {
    const todo: Todo = { id: 'b', content: '운동', stickerCount: 0, deadline: '2026-11-16', recurrence: { type: 'daily' } };
    const refreshed = refreshRecurringTodo(todo);
    assert.equal(refreshed.deadline, '2026-11-16');
    assert.equal(refreshed.missedCount, 0);
  });

  it('반복 문구와 상태', () => {
    assert.equal(formatRecurrenceLabel({ type: 'daily' }), '매일');
    assert.equal(formatRecurrenceLabel({ type: 'weekly', weekdays: [5, 1, 3] }), '매주 월·수·금');
    assert.equal(formatRecurrenceLabel({ type: 'monthly', dayOfMonth: 'last' }), '매월 말일');
    assert.equal(formatRecurrenceLabel({ type: 'monthly', dayOfMonth: 15 }), '매월 15일');
    assert.deepEqual(getRecurrenceStatus({ recurrence: { type: 'daily' }, missedCount: 2, consecutiveCompletions: 5 }), { label: '미완료 2회', variant: 'missed' });
    assert.deepEqual(getRecurrenceStatus({ recurrence: { type: 'daily' }, consecutiveCompletions: 5 }), { label: '5회 연속 완료', variant: 'streak' });
    assert.equal(getRecurrenceStatus({}), null);
  });
});
