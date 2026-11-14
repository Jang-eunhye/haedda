import { mock } from 'node:test';

/** 테스트 기준 '지금': 2026년 11월 14일(토) 오전 10시 (로컬 시간) */
export const NOW = new Date(2026, 10, 14, 10, 0, 0);

/** Date를 NOW로 고정한다. 각 테스트 파일의 before/after에서 쓴다 */
export function freezeTime(now: Date = NOW) {
  mock.timers.enable({ apis: ['Date'], now: now.getTime() });
}

export function unfreezeTime() {
  mock.timers.reset();
}
