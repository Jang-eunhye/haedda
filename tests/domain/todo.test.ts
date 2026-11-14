import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Todo } from '@haedda/types';
import { claimReward, clearCategoryFromTodos, completeTodoInList, parseCategoriesFromUnknown, parseTodosFromUnknown } from '@haedda/domain';
import { freezeTime, unfreezeTime } from '../helpers.ts';

describe('할일 완료', () => {
  before(() => freezeTime());
  after(() => unfreezeTime());

  it('일회성 할일은 목록에서 빠지고 스티커를 받는다', () => {
    const todos: Todo[] = [{ id: 'a', content: '영어', stickerCount: 3, deadline: '2026-11-14' }, { id: 'b', content: '빨래', stickerCount: 0 }];
    const outcome = completeTodoInList(todos, 'a');
    assert.deepEqual(outcome.todos.map(t => t.id), ['b']);
    assert.equal(outcome.stickersEarned, 3);
    assert.equal(outcome.result?.earned, 3);
    assert.equal(outcome.result?.isRecurring, false);
  });

  it('기한이 지난 할일은 완료해도 스티커가 없다', () => {
    const outcome = completeTodoInList([{ id: 'a', content: '보고서', stickerCount: 2, deadline: '2026-11-12' }], 'a');
    assert.equal(outcome.stickersEarned, 0);
    assert.equal(outcome.result?.stickerCount, 2);
  });

  it('반복 할일은 다음 주기로 넘어가고 연속 완료가 1 늘며 미완료는 0이 된다', () => {
    const todos: Todo[] = [{ id: 'r', content: '스트레칭', stickerCount: 1, deadline: '2026-11-14', recurrence: { type: 'daily' }, consecutiveCompletions: 4, missedCount: 2 }];
    const outcome = completeTodoInList(todos, 'r');
    assert.equal(outcome.todos.length, 1);
    assert.equal(outcome.todos[0].deadline, '2026-11-15');
    assert.equal(outcome.todos[0].consecutiveCompletions, 5);
    assert.equal(outcome.todos[0].missedCount, 0);
    assert.equal(outcome.result?.nextDeadline, '2026-11-15');
    assert.equal(outcome.stickersEarned, 1);
  });

  it('없는 할일은 아무것도 바꾸지 않는다', () => {
    const todos: Todo[] = [{ id: 'a', content: 'x', stickerCount: 1 }];
    const outcome = completeTodoInList(todos, 'zzz');
    assert.equal(outcome.todos, todos);
    assert.equal(outcome.result, null);
  });

  it('카테고리를 지우면 그 할일은 미분류가 된다', () => {
    const todos = clearCategoryFromTodos([{ id: 'a', content: 'x', stickerCount: 0, categoryId: 'c1' }, { id: 'b', content: 'y', stickerCount: 0, categoryId: 'c2' }], 'c1');
    assert.equal(todos[0].categoryId, undefined);
    assert.equal(todos[1].categoryId, 'c2');
  });
});

describe('보상 받기', () => {
  const rewards = [{ id: 'r1', content: '치킨', stickerCost: 10 }];

  it('스티커가 충분하면 차감한다', () => {
    assert.deepEqual(claimReward(rewards, 12, 'r1'), { success: true, nextTotalStickers: 2 });
    assert.deepEqual(claimReward(rewards, 10, 'r1'), { success: true, nextTotalStickers: 0 });
  });

  it('부족하거나 없는 보상이면 그대로 둔다', () => {
    assert.deepEqual(claimReward(rewards, 9, 'r1'), { success: false, nextTotalStickers: 9 });
    assert.deepEqual(claimReward(rewards, 50, 'nope'), { success: false, nextTotalStickers: 50 });
  });
});

describe('저장된 데이터 읽기', () => {
  before(() => freezeTime());
  after(() => unfreezeTime());

  it('깨진 할일 항목은 빼고 읽는다', () => {
    const todos = parseTodosFromUnknown([{ id: 'a', content: '정상', stickerCount: 1 }, { foo: 1 }, null, 'text']);
    assert.deepEqual(todos.map(t => t.id), ['a']);
  });

  it('배열이 아니면 빈 목록', () => {
    assert.deepEqual(parseTodosFromUnknown({}), []);
    assert.deepEqual(parseCategoriesFromUnknown(undefined), []);
  });
});
