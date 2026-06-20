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

/** 월요일~일요일 (오늘 포함) */
export function getWeekRangeISO(ref: Date = new Date()): { start: string; end: string } {
  const monday = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const day = monday.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  monday.setDate(monday.getDate() - daysSinceMonday);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return { start: formatDateISO(monday), end: formatDateISO(sunday) };
}

export function isDeadlineInRange(deadline: string, start: string, end: string): boolean {
  const d = normalizeDeadline(deadline);
  return d >= start && d <= end;
}

export function isDeadlineToday(deadline: string): boolean {
  return normalizeDeadline(deadline) === getTodayISO();
}

export function isDeadlineThisMonth(deadline: string, ref: Date = new Date()): boolean {
  const { year, month } = parseDateParts(deadline);
  return year === ref.getFullYear() && month === ref.getMonth() + 1;
}
