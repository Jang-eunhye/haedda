import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDateISO,
  formatDeadlineDDay,
  formatDeadlineLabel,
  formatDeadlineShortLabel,
  getDeadlineDayDiff,
  getMonthEndISO,
  getTodayISO,
  getTomorrowISO,
  getWeekEndISO,
  getWeekRangeISO,
  isDeadlineExpired,
  isDeadlineToday,
  normalizeDeadline,
} from '@haedda/utils';
import { NOW, freezeTime, unfreezeTime } from '../helpers.ts';

describe('날짜 유틸', () => {
  before(() => freezeTime());
  after(() => unfreezeTime());

  it('오늘·내일을 YYYY-MM-DD로 돌려준다', () => {
    assert.equal(getTodayISO(), '2026-11-14');
    assert.equal(getTomorrowISO(NOW), '2026-11-15');
    assert.equal(formatDateISO(new Date(2026, 0, 5)), '2026-01-05');
  });

  it('주는 월요일~일요일, 월말은 그 달 마지막 날이다', () => {
    assert.deepEqual(getWeekRangeISO(NOW), { start: '2026-11-09', end: '2026-11-15' });
    assert.equal(getWeekEndISO(NOW), '2026-11-15');
    assert.equal(getMonthEndISO(NOW), '2026-11-30');
    assert.equal(getMonthEndISO(new Date(2028, 1, 10)), '2028-02-29');
  });

  it('마감일은 당일까지 유효하고 다음 날부터 지난 것으로 본다', () => {
    assert.equal(isDeadlineExpired('2026-11-14'), false);
    assert.equal(isDeadlineExpired('2026-11-13'), true);
    assert.equal(isDeadlineExpired(undefined), false);
    assert.equal(isDeadlineToday('2026-11-14'), true);
  });

  it('D-day를 남은 날은 D-N, 지난 날은 D+N으로 표시한다', () => {
    assert.equal(getDeadlineDayDiff('2026-11-17'), 3);
    assert.equal(formatDeadlineDDay('2026-11-17'), 'D-3');
    assert.equal(formatDeadlineDDay('2026-11-14'), 'D-0');
    assert.equal(formatDeadlineDDay('2026-11-12'), 'D+2');
  });

  it('시간이 붙은 예전 마감일 값도 날짜만 쓴다', () => {
    assert.equal(normalizeDeadline('2026-11-20T09:00:00'), '2026-11-20');
  });

  it('날짜 문구', () => {
    assert.equal(formatDeadlineLabel('2026-11-04'), '2026년 11월 4일');
    assert.equal(formatDeadlineShortLabel('2026-11-04'), '11월 4일');
  });
});
