import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Todo } from '@haedda/types';
import { getDeadlineForPreset, detectDeadlinePreset, isMissedTodo, matchesCategoryFilter, matchesTodoFilter, sortMissedTodos } from '@haedda/utils';
import { NOW, freezeTime, unfreezeTime } from '../helpers.ts';

const todo = (over: Partial<Todo>): Todo => ({ id: over.id ?? 'x', content: '할일', stickerCount: 0, ...over });

describe('할일 필터', () => {
  before(() => freezeTime());
  after(() => unfreezeTime());

  const today = todo({ id: 'today', deadline: '2026-11-14' });
  const sunday = todo({ id: 'sun', deadline: '2026-11-15' });
  const nextWeek = todo({ id: 'next', deadline: '2026-11-20' });
  const later = todo({ id: 'later' });

  it('오늘 / 나중에 / 스티커', () => {
    assert.equal(matchesTodoFilter(today, 'today', {}, NOW), true);
    assert.equal(matchesTodoFilter(sunday, 'today', {}, NOW), false);
    assert.equal(matchesTodoFilter(later, 'later', {}, NOW), true);
    assert.equal(matchesTodoFilter(todo({ stickerCount: 2 }), 'sticker', {}, NOW), true);
  });

  it('이번주는 기본으로 오늘 마감을 빼고, 옵션을 끄면 넣는다', () => {
    assert.equal(matchesTodoFilter(sunday, 'week', {}, NOW), true);
    assert.equal(matchesTodoFilter(today, 'week', {}, NOW), false);
    assert.equal(matchesTodoFilter(today, 'week', { excludeTodayFromWeek: false }, NOW), true);
    assert.equal(matchesTodoFilter(nextWeek, 'week', {}, NOW), false);
  });

  it('이번달은 기본으로 이번주 마감을 뺀다', () => {
    assert.equal(matchesTodoFilter(nextWeek, 'month', {}, NOW), true);
    assert.equal(matchesTodoFilter(sunday, 'month', {}, NOW), false);
    assert.equal(matchesTodoFilter(sunday, 'month', { excludeWeekFromMonth: false }, NOW), true);
  });

  it('카테고리 필터', () => {
    assert.equal(matchesCategoryFilter(todo({ categoryId: 'c1' }), 'c1'), true);
    assert.equal(matchesCategoryFilter(todo({}), 'uncategorized'), true);
    assert.equal(matchesCategoryFilter(todo({ categoryId: 'c1' }), 'all'), true);
  });

  it('놓친 할일: 일회성은 기한이 지나면, 반복은 미완료 횟수가 있으면', () => {
    assert.equal(isMissedTodo(todo({ deadline: '2026-11-13' })), true);
    assert.equal(isMissedTodo(today), false);
    assert.equal(isMissedTodo(todo({ deadline: '2026-11-14', recurrence: { type: 'daily' }, missedCount: 1 })), true);
    const sorted = sortMissedTodos([todo({ id: 'b', deadline: '2026-11-13' }), todo({ id: 'a', deadline: '2026-11-10' })]);
    assert.deepEqual(sorted.map(t => t.id), ['a', 'b']);
  });

  it('기한 프리셋', () => {
    assert.equal(getDeadlineForPreset('today', NOW), '2026-11-14');
    assert.equal(getDeadlineForPreset('tomorrow', NOW), '2026-11-15');
    assert.equal(getDeadlineForPreset('week', NOW), '2026-11-15');
    assert.equal(getDeadlineForPreset('month', NOW), '2026-11-30');
    assert.equal(detectDeadlinePreset(undefined, NOW), 'later');
    assert.equal(detectDeadlinePreset('2026-11-20', NOW), 'custom');
  });
});
