/** deadline을 YYYY-MM-DD 형식으로 정규화 */
export function normalizeDeadline(deadline: string): string {
  return deadline.slice(0, 10);
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayISO(): string {
  return formatDateISO(new Date());
}

/** 기한 당일까지 유효, 다음 날부터 만료 */
export function isDeadlineExpired(deadline: string): boolean {
  return getTodayISO() > normalizeDeadline(deadline);
}

export function formatDeadlineLabel(deadline: string): string {
  const [y, m, d] = normalizeDeadline(deadline).split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function parseDateParts(iso: string): { year: number; month: number; day: number } {
  const normalized = normalizeDeadline(iso);
  const [year, month, day] = normalized.split('-').map(Number);
  return { year, month, day };
}
